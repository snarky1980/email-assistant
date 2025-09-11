import { useState, useRef, useEffect } from 'react'

/**
 * 🎨 COMPOSANT TEXTAREA AVEC SURLIGNAGE DES VARIABLES
 * 
 * Ce composant superpose une div avec le texte surligné sur un textarea transparent
 * pour créer l'effet de surlignage en temps réel pendant l'édition.
 */
const HighlightedTextarea = ({ 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  variables = {}, 
  templatesData = null,
  minHeight = '60px'
}) => {
  const textareaRef = useRef(null)
  const highlightRef = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // 🎨 Couleurs élégantes et subtiles pour les variables
  const VARIABLE_COLORS = {
    email: 'bg-blue-100/70 text-blue-800 border-blue-200/50',
    phone: 'bg-green-100/70 text-green-800 border-green-200/50',
    date: 'bg-purple-100/70 text-purple-800 border-purple-200/50',
    time: 'bg-orange-100/70 text-orange-800 border-orange-200/50',
    number: 'bg-amber-100/70 text-amber-800 border-amber-200/50',
    text: 'bg-gray-100/70 text-gray-800 border-gray-200/50',
    default: 'bg-indigo-100/70 text-indigo-800 border-indigo-200/50',
    unknown: 'bg-red-100/70 text-red-800 border-red-200/50'
  }

  // 🎯 Obtenir la couleur selon le type de variable
  const getVariableColor = (variableName) => {
    const variableInfo = templatesData?.variables?.[variableName]
    if (!variableInfo) return VARIABLE_COLORS.unknown
    return VARIABLE_COLORS[variableInfo.type] || VARIABLE_COLORS.default
  }

  // ✨ Créer le HTML avec surlignage
  const createHighlightedHTML = (text) => {
    if (!text) return ''
    
    // Échapper le HTML pour éviter les injections
    const escapeHtml = (str) => {
      const div = document.createElement('div')
      div.textContent = str
      return div.innerHTML
    }

    // Diviser le texte en parties (variables et texte normal)
    const parts = text.split(/(<<[^>]+>>)/g)
    
    return parts.map(part => {
      const variableMatch = part.match(/^<<([^>]+)>>$/)
      
      if (variableMatch) {
        const variableName = variableMatch[1]
        const variableValue = variables[variableName]
        const colorClasses = getVariableColor(variableName)
        const displayValue = variableValue || `<<${variableName}>>`
        
        return `<span class="inline-block px-1.5 py-0.5 mx-0.5 rounded text-xs font-medium border ${colorClasses} transition-all duration-200">${escapeHtml(displayValue)}</span>`
      }
      
      return escapeHtml(part)
    }).join('')
  }

  // 🔄 Synchroniser le scroll entre textarea et highlight
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      const scrollTop = textareaRef.current.scrollTop
      const scrollLeft = textareaRef.current.scrollLeft
      setScrollTop(scrollTop)
      setScrollLeft(scrollLeft)
      highlightRef.current.scrollTop = scrollTop
      highlightRef.current.scrollLeft = scrollLeft
    }
  }

  // 📝 Gérer les changements de texte
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <div className="relative">
      {/* 🎨 Couche de surlignage */}
      <div
        ref={highlightRef}
        className={`absolute inset-0 pointer-events-none overflow-hidden whitespace-pre-wrap break-words ${className}`}
        style={{
          minHeight,
          padding: '0.75rem',
          lineHeight: '1.5',
          fontSize: '0.875rem',
          fontFamily: 'inherit',
          border: '2px solid transparent',
          borderRadius: '0.375rem',
          scrollTop: scrollTop,
          scrollLeft: scrollLeft
        }}
        dangerouslySetInnerHTML={{
          __html: createHighlightedHTML(value)
        }}
      />
      
      {/* ✏️ Textarea transparent */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onScroll={handleScroll}
        placeholder={placeholder}
        className={`relative bg-transparent resize-none ${className}`}
        style={{
          minHeight,
          color: 'transparent',
          caretColor: '#374151' // Couleur du curseur visible
        }}
      />
    </div>
  )
}

export default HighlightedTextarea

