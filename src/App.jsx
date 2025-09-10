import React, { useState, useEffect, useMemo, useRef } from 'react'
import { loadState, saveState } from '@/utils/storage';
import { Search, FileText, Copy, RotateCcw, Languages, Filter, Globe, Sparkles, Mail, Edit3 } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import './App.css'

function App() {
  // Charger l'état sauvegardé
  const savedState = loadState()
  
  // État pour les données des templates
  const [templatesData, setTemplatesData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Séparer la langue de l'interface de la langue des modèles
  const [interfaceLanguage, setInterfaceLanguage] = useState(savedState.interfaceLanguage || 'fr') // Langue de l'interface
  const [templateLanguage, setTemplateLanguage] = useState(savedState.templateLanguage || 'fr')   // Langue des modèles
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [searchQuery, setSearchQuery] = useState(savedState.searchQuery || '')
  const [selectedCategory, setSelectedCategory] = useState(savedState.selectedCategory || 'all')
  const [finalSubject, setFinalSubject] = useState('') // Version finale éditable
  const [finalBody, setFinalBody] = useState('') // Version finale éditable
  const [variables, setVariables] = useState(savedState.variables || {})
  const [copySuccess, setCopySuccess] = useState(false)
  
  // 🎯 RÉFÉRENCES POUR LES RACCOURCIS CLAVIER
  const searchRef = useRef(null) // Référence pour focus sur la recherche (Ctrl+J)

  // Sauvegarder automatiquement les préférences importantes
  useEffect(() => {
    saveState({
      interfaceLanguage,
      templateLanguage,
      searchQuery,
      selectedCategory,
      variables
    })
  }, [interfaceLanguage, templateLanguage, searchQuery, selectedCategory, variables])

  // Textes de l'interface selon la langue
  const interfaceTexts = {
    fr: {
      title: 'Assistant pour rédaction de courriels aux clients',
      subtitle: 'Bureau de la traduction',
      selectTemplate: 'Sélectionnez un modèle',
      templatesCount: `modèles disponibles`,
      searchPlaceholder: '🔍 Rechercher un modèle...',
      allCategories: 'Toutes les catégories',
      categories: {
        'Devis et estimations': 'Devis et estimations',
        'Gestion de projets': 'Gestion de projets', 
        'Problèmes techniques': 'Problèmes techniques',
        'Communications générales': 'Communications générales',
        'Services spécialisés': 'Services spécialisés'
      },
      templateLanguage: 'Langue du modèle:',
      interfaceLanguage: 'Langue de l\'interface:',
      variables: 'Variables',
      editEmail: 'Éditez votre courriel',
      subject: 'Objet',
      body: 'Corps du message',
      reset: 'Réinitialiser',
      copy: 'Copier',
      copySubject: 'Copier Objet',
      copyBody: 'Copier Corps', 
      copyAll: 'Copier Tout',
      copied: 'Copié !',
      noTemplate: 'Sélectionnez un modèle pour commencer'
    },
    en: {
      title: 'Email Writing Assistant for Clients',
      subtitle: 'Translation Bureau',
      selectTemplate: 'Select a template',
      templatesCount: `templates available`,
      searchPlaceholder: '🔍 Search for a template...',
      allCategories: 'All categories',
      categories: {
        'Devis et estimations': 'Quotes and estimates',
        'Gestion de projets': 'Project management', 
        'Problèmes techniques': 'Technical issues',
        'Communications générales': 'General communications',
        'Services spécialisés': 'Specialized services'
      },
      templateLanguage: 'Template language:',
      interfaceLanguage: 'Interface language:',
      variables: 'Variables',
      editEmail: 'Edit your email',
      subject: 'Subject',
      body: 'Message body',
      reset: 'Reset',
      copy: 'Copy',
      copySubject: 'Copy Subject',
      copyBody: 'Copy Body',
      copyAll: 'Copy All',
      copied: 'Copied!',
      noTemplate: 'Select a template to get started'
    }
  }

  const t = interfaceTexts[interfaceLanguage]

  // Charger les données des templates au démarrage
  useEffect(() => {
    const loadTemplatesData = async () => {
      try {
        const response = await fetch('/email-assistant/complete_email_templates.json')
        if (!response.ok) {
          throw new Error('Failed to load templates data')
        }
        const data = await response.json()
        setTemplatesData(data)
      } catch (error) {
        console.error('Error loading templates data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadTemplatesData()
  }, [])

  /**
   * 🔗 SUPPORT DES PARAMÈTRES URL POUR PARTAGE DE LIENS PROFONDS
   * 
   * Permet de partager des liens directs vers un template spécifique :
   * - ?id=devis_avec_approbation : Pré-sélectionne ce template
   * - &lang=en : Force la langue anglaise
   * 
   * Exemple d'URL complète :
   * https://monsite.com/email-assistant/?id=devis_avec_approbation&lang=en
   * 
   * UX: Idéal pour partager des liens dans Teams/Slack vers un template précis
   */
  useEffect(() => {
    if (!templatesData) return
    
    // 📖 Lire les paramètres de l'URL actuelle
    const params = new URLSearchParams(window.location.search)
    const templateId = params.get('id')
    const langParam = params.get('lang')
    
    // 🌐 Appliquer la langue depuis l'URL si spécifiée et valide
    if (langParam && ['fr', 'en'].includes(langParam)) {
      setTemplateLanguage(langParam)
      setInterfaceLanguage(langParam)
    }
    
    // 🎯 Pré-sélectionner le template depuis l'URL
    if (templateId) {
      const template = templatesData.templates.find(t => t.id === templateId)
      if (template) {
        setSelectedTemplate(template)
      }
    }
  }, [templatesData]) // Se déclenche quand les templates sont chargés

  /**
   * ⌨️ RACCOURCIS CLAVIER POUR UNE UX PROFESSIONNELLE
   * 
   * Raccourcis inspirés des logiciels professionnels pour une utilisation rapide :
   * - Ctrl/Cmd + Enter : Copier tout l'email (action principale)
   * - Ctrl/Cmd + B : Copier le corps seulement (Body)
   * - Ctrl/Cmd + J : Focus sur la recherche (Jump to search)
   * 
   * Compatible Mac (Cmd) et PC (Ctrl) pour une expérience universelle
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 🚀 Ctrl/Cmd + Enter : Copier tout (action rapide principale)
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (selectedTemplate) {
          copyToClipboard('all')
        }
      }
      
      // 📝 Ctrl/Cmd + B : Copier le corps seulement (Body)
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        if (selectedTemplate) {
          copyToClipboard('body')
        }
      }
      
      // 🔍 Ctrl/Cmd + J : Focus sur la recherche (Jump to search)
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault()
        if (searchRef.current) {
          searchRef.current.focus()
        }
      }
    }

    // 🎯 Attacher les événements clavier globalement
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedTemplate]) // Re-bind quand le template change

  // Filtrer les modèles selon la recherche et la catégorie
  const filteredTemplates = useMemo(() => {
    if (!templatesData) return []
    let filtered = templatesData.templates

    if (searchQuery) {
      filtered = filtered.filter(template => 
        template.title[templateLanguage]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description[templateLanguage]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    return filtered
  }, [templatesData, searchQuery, selectedCategory, templateLanguage])

  // Obtenir les catégories uniques
  const categories = useMemo(() => {
    if (!templatesData) return []
    const cats = [...new Set(templatesData.templates.map(t => t.category))]
    return cats
  }, [templatesData])

  // Remplacer les variables dans le texte
  const replaceVariables = (text) => {
    let result = text
    Object.entries(variables).forEach(([varName, value]) => {
      const regex = new RegExp(`<<${varName}>>`, 'g')
      result = result.replace(regex, value || `<<${varName}>>`)
    })
    return result
  }

  /**
   * 🎨 SURBRILLANCE DES VARIABLES DANS LE TEXTE
   * 
   * Convertit le texte avec variables en JSX avec surbrillance colorée
   * - Variables remplies : fond vert clair
   * - Variables vides : fond orange clair avec bordure
   * - Couleurs distinctes pour faciliter l'identification
   */
  const highlightVariables = (text) => {
    if (!text) return text
    
    // Couleurs pour différents types de variables
    const getVariableColor = (varName) => {
      const varInfo = templatesData?.variables?.[varName]
      if (!varInfo) return 'bg-gray-100 text-gray-700'
      
      switch (varInfo.type) {
        case 'email': return 'bg-blue-100 text-blue-800 border-blue-300'
        case 'phone': return 'bg-green-100 text-green-800 border-green-300'
        case 'date': return 'bg-purple-100 text-purple-800 border-purple-300'
        case 'number': return 'bg-orange-100 text-orange-800 border-orange-300'
        default: return 'bg-indigo-100 text-indigo-800 border-indigo-300'
      }
    }
    
    // Diviser le texte en parties et identifier les variables
    const parts = text.split(/(<<[^>]+>>)/g)
    
    return parts.map((part, index) => {
      const variableMatch = part.match(/^<<([^>]+)>>$/)
      
      if (variableMatch) {
        const varName = variableMatch[1]
        const value = variables[varName]
        const colorClass = getVariableColor(varName)
        const isEmpty = !value || value.trim() === ''
        
        return (
          <span
            key={index}
            className={`inline-block px-2 py-1 rounded-md text-sm font-semibold border-2 transition-all duration-300 ${colorClass} ${
              isEmpty ? 'animate-pulse border-dashed' : 'border-solid'
            }`}
            title={`Variable: ${varName}${isEmpty ? ' (vide)' : ` = ${value}`}`}
          >
            {value || `<<${varName}>>`}
          </span>
        )
      }
      
      return part
    })
  }

  // Charger un modèle sélectionné
  useEffect(() => {
    if (selectedTemplate) {
      // Initialiser les variables avec des valeurs par défaut
      const initialVars = {}
      selectedTemplate.variables.forEach(varName => {
        const varInfo = templatesData.variables[varName]
        if (varInfo) {
          initialVars[varName] = varInfo.example || ''
        }
      })
      setVariables(initialVars)
      
      // Mettre à jour les versions finales avec les variables remplacées
      const subjectWithVars = replaceVariables(selectedTemplate.subject[templateLanguage] || '')
      const bodyWithVars = replaceVariables(selectedTemplate.body[templateLanguage] || '')
      setFinalSubject(subjectWithVars)
      setFinalBody(bodyWithVars)
    }
  }, [selectedTemplate, templateLanguage])

  // Mettre à jour les versions finales quand les variables changent
  useEffect(() => {
    if (selectedTemplate) {
      const subjectWithVars = replaceVariables(selectedTemplate.subject[templateLanguage] || '')
      const bodyWithVars = replaceVariables(selectedTemplate.body[templateLanguage] || '')
      setFinalSubject(subjectWithVars)
      setFinalBody(bodyWithVars)
    }
  }, [variables, selectedTemplate, templateLanguage])

  /**
   * 📋 FONCTION DE COPIE GRANULAIRE
   * Permet de copier différentes parties de l'email selon le besoin de l'utilisateur
   * 
   * @param {string} type - Type de contenu à copier ('subject', 'body', 'all')
   * 
   * UX: Chaque type de copie a son propre bouton avec des couleurs distinctives
   * - Objet (bleu) : Pour coller uniquement dans le champ "Subject" d'Outlook/Teams
   * - Corps (vert) : Pour coller le contenu principal sans l'objet
   * - Tout (gradient) : Copie complète avec objet + corps (comportement original)
   */
  const copyToClipboard = async (type = 'all') => {
    let content = ''
    
    // 🎯 Sélection du contenu selon le type demandé
    switch (type) {
      case 'subject':
        content = finalSubject
        break
      case 'body':
        content = finalBody
        break
      case 'all':
      default:
        content = `${finalSubject}\n\n${finalBody}`
        break
    }
    
    try {
      // 🔒 Méthode moderne et sécurisée (HTTPS requis)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content)
      } else {
        // 🔄 Fallback pour navigateurs anciens ou contextes non-sécurisés
        const textArea = document.createElement('textarea')
        textArea.value = content
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      
      // ✅ Feedback visuel de succès (2 secondes)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Erreur lors de la copie:', error)
      // 🚨 Gestion d'erreur avec message utilisateur
      alert('Erreur lors de la copie. Veuillez sélectionner le texte manuellement et utiliser Ctrl+C.')
    }
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    if (selectedTemplate) {
      const initialVars = {}
      selectedTemplate.variables.forEach(varName => {
        const varInfo = templatesData.variables[varName]
        if (varInfo) {
          initialVars[varName] = varInfo.example || ''
        }
      })
      setVariables(initialVars)
      
      // Réinitialiser les versions finales
      const subjectWithVars = replaceVariables(selectedTemplate.subject[templateLanguage] || '')
      const bodyWithVars = replaceVariables(selectedTemplate.body[templateLanguage] || '')
      setFinalSubject(subjectWithVars)
      setFinalBody(bodyWithVars)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des modèles...</p>
          </div>
        </div>
      ) : (
        <>
      {/* En-tête dynamique */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Mail className="h-10 w-10 text-white animate-pulse" />
                <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">{t.title}</h1>
                <p className="text-blue-100 text-sm">{t.subtitle}</p>
              </div>
            </div>
            
            {/* Langue de l'interface avec style moderne */}
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <Globe className="h-5 w-5 text-white" />
              <span className="text-white font-medium">{t.interfaceLanguage}:</span>
              <div className="flex bg-white/20 rounded-lg p-1">
                <button
                  onClick={() => setInterfaceLanguage('fr')}
                  className={`px-4 py-2 text-sm font-bold rounded-md transition-all duration-300 ${
                    interfaceLanguage === 'fr'
                      ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setInterfaceLanguage('en')}
                  className={`px-4 py-2 text-sm font-bold rounded-md transition-all duration-300 ${
                    interfaceLanguage === 'en'
                      ? 'bg-white text-blue-600 shadow-lg transform scale-105'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panneau de gauche - Liste des modèles */}
          <div className="lg:col-span-1">
            <Card className="h-fit shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-blue-50">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-blue-600" />
                  {t.selectTemplate}
                </CardTitle>
                <p className="text-sm text-gray-600">{filteredTemplates.length} {t.templatesCount}</p>
                
                {/* Filtre par catégorie avec style */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-purple-400 transition-all duration-300">
                    <Filter className="h-4 w-4 mr-2 text-purple-500" />
                    <SelectValue placeholder={t.allCategories} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allCategories}</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {t.categories[category] || category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Recherche avec style moderne */}
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                      ref={searchRef}
                      type="text"
                      placeholder={t.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-2 border-orange-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                    />
                </div>

                {/* Langue des modèles avec style moderne */}
                <div className="flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3">
                  <Languages className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-semibold text-gray-700">{t.templateLanguage}:</span>
                  <div className="flex bg-white rounded-lg p-1 shadow-sm">
                    <button
                      onClick={() => setTemplateLanguage('fr')}
                      className={`px-3 py-1 text-sm font-bold rounded-md transition-all duration-300 ${
                        templateLanguage === 'fr'
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      FR
                    </button>
                    <button
                      onClick={() => setTemplateLanguage('en')}
                      className={`px-3 py-1 text-sm font-bold rounded-md transition-all duration-300 ${
                        templateLanguage === 'en'
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-96">
                  <div className="space-y-3 p-4">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-102 ${
                          selectedTemplate?.id === template.id
                            ? 'border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg transform scale-102'
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-sm mb-1">
                              {template.title[templateLanguage]}
                            </h3>
                            <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                              {template.description[templateLanguage]}
                            </p>
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200"
                            >
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Panneau de droite - Édition */}
          <div className="lg:col-span-2 space-y-6">
            {selectedTemplate ? (
              <>
                {/* Variables avec style moderne */}
                {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-orange-50 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                        <Edit3 className="h-6 w-6 mr-2 text-orange-600" />
                        {t.variables}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedTemplate.variables.map((varName) => {
                          const varInfo = templatesData.variables[varName]
                          if (!varInfo) return null
                          
                          const currentValue = variables[varName] || ''
                          const isEmpty = !currentValue.trim()
                          
                          // Validation en temps réel
                          const getValidationStatus = () => {
                            if (isEmpty) return { valid: false, message: 'Requis' }
                            
                            switch (varInfo.type) {
                              case 'email':
                                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                return emailRegex.test(currentValue) 
                                  ? { valid: true, message: 'Valide' }
                                  : { valid: false, message: 'Format invalide' }
                              
                              case 'phone':
                                const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/
                                return phoneRegex.test(currentValue)
                                  ? { valid: true, message: 'Valide' }
                                  : { valid: false, message: 'Format invalide' }
                              
                              case 'number':
                                const isNumber = !isNaN(parseFloat(currentValue))
                                return isNumber
                                  ? { valid: true, message: 'Valide' }
                                  : { valid: false, message: 'Nombre requis' }
                              
                              default:
                                return { valid: true, message: 'OK' }
                            }
                          }
                          
                          const validation = getValidationStatus()
                          
                          // Couleur selon le type de variable
                          const getTypeColor = () => {
                            switch (varInfo.type) {
                              case 'email': return 'border-blue-300 focus:border-blue-500'
                              case 'phone': return 'border-green-300 focus:border-green-500'
                              case 'date': return 'border-purple-300 focus:border-purple-500'
                              case 'number': return 'border-orange-300 focus:border-orange-500'
                              default: return 'border-gray-300 focus:border-gray-500'
                            }
                          }
                          
                          return (
                            <div key={varName} className="bg-white rounded-md p-3 border border-gray-200 hover:border-orange-300 transition-all duration-200">
                              {/* En-tête compact */}
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-semibold text-gray-700 flex items-center">
                                  <span className={`w-2 h-2 rounded-full mr-1.5 ${
                                    varInfo.type === 'email' ? 'bg-blue-400' :
                                    varInfo.type === 'phone' ? 'bg-green-400' :
                                    varInfo.type === 'date' ? 'bg-purple-400' :
                                    varInfo.type === 'number' ? 'bg-orange-400' :
                                    'bg-gray-400'
                                  }`}></span>
                                  {varInfo.description[interfaceLanguage]}
                                </label>
                                
                                {/* Badge du type compact */}
                                <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                                  {varInfo.type}
                                </Badge>
                              </div>
                              
                              {/* Champ de saisie compact */}
                              <Input
                                value={currentValue}
                                onChange={(e) => setVariables(prev => ({
                                  ...prev,
                                  [varName]: e.target.value
                                }))}
                                placeholder={varInfo.example}
                                className={`text-sm h-8 border transition-all duration-200 ${getTypeColor()} ${
                                  !validation.valid && !isEmpty ? 'border-red-300 focus:border-red-500' : ''
                                }`}
                              />
                              
                              {/* Indicateur de validation compact */}
                              <div className="flex items-center justify-between mt-1">
                                <div className={`text-xs flex items-center ${
                                  validation.valid ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                    validation.valid ? 'bg-green-400' : 'bg-red-400'
                                  }`}></span>
                                  {validation.message}
                                </div>
                                
                                {/* Compteur de caractères compact */}
                                {varInfo.type === 'text' && currentValue.length > 0 && (
                                  <span className="text-xs text-gray-400">
                                    {currentValue.length}
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Version éditable - ZONE PRINCIPALE */}
                <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-green-50 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                      <Mail className="h-7 w-7 mr-3 text-green-600" />
                      {t.editEmail}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Aperçu avec surbrillance des variables */}
                    {selectedTemplate && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
                        <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Aperçu avec variables surlignées
                        </h4>
                        
                        {/* Aperçu objet */}
                        <div className="mb-4">
                          <div className="text-xs font-semibold text-blue-700 mb-1">OBJET:</div>
                          <div className="bg-white p-3 rounded border text-sm leading-relaxed">
                            {highlightVariables(selectedTemplate.subject[templateLanguage] || '')}
                          </div>
                        </div>
                        
                        {/* Aperçu corps */}
                        <div>
                          <div className="text-xs font-semibold text-blue-700 mb-1">CORPS:</div>
                          <div className="bg-white p-3 rounded border text-sm leading-relaxed max-h-32 overflow-y-auto">
                            {highlightVariables(selectedTemplate.body[templateLanguage] || '')}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Objet éditable */}
                    <div className="space-y-3">
                      <label className="text-lg font-bold text-gray-700 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        {t.subject}
                      </label>
                      <Textarea
                        value={finalSubject}
                        onChange={(e) => setFinalSubject(e.target.value)}
                        className="min-h-[60px] resize-none border-3 border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-lg font-medium"
                        placeholder={t.subject}
                      />
                    </div>

                    {/* Corps éditable */}
                    <div className="space-y-3">
                      <label className="text-lg font-bold text-gray-700 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        {t.body}
                      </label>
                      <Textarea
                        value={finalBody}
                        onChange={(e) => setFinalBody(e.target.value)}
                        className="min-h-[250px] border-3 border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-base leading-relaxed"
                        placeholder={t.body}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Actions avec style moderne */}
                <div className="flex justify-end space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    {t.reset}
                  </Button>
                  
                  {/* 
                    🎨 BOUTONS DE COPIE GRANULAIRE - UX AMÉLIORÉE
                    
                    Design pensé pour l'efficacité :
                    - 3 boutons distincts avec codes couleur intuitifs
                    - Tooltips explicatifs avec raccourcis clavier
                    - Animations hover pour feedback visuel
                    - Groupement logique (outline + principal)
                  */}
                  <div className="flex space-x-2">
                    {/* 📧 Bouton Copie Objet - Bleu (associé aux emails) */}
                    <Button 
                      onClick={() => copyToClipboard('subject')} 
                      variant="outline"
                      className="font-medium px-4 py-2 border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                      title="Copier l'objet seulement (Ctrl+J)"
                    >
                      <Mail className="h-4 w-4 mr-2 group-hover:text-blue-600" />
                      {t.copySubject || 'Objet'}
                    </Button>
                    
                    {/* 📝 Bouton Copie Corps - Vert (associé au contenu) */}
                    <Button 
                      onClick={() => copyToClipboard('body')} 
                      variant="outline"
                      className="font-medium px-4 py-2 border-2 border-green-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300 group"
                      title="Copier le corps seulement (Ctrl+B)"
                    >
                      <Edit3 className="h-4 w-4 mr-2 group-hover:text-green-600" />
                      {t.copyBody || 'Corps'}
                    </Button>
                    
                    {/* 🚀 Bouton Copie Complète - Gradient (action principale) */}
                    <Button 
                      onClick={() => copyToClipboard('all')} 
                      className={`font-bold px-6 py-3 transition-all duration-300 shadow-lg ${
                        copySuccess 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform scale-105' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105'
                      }`}
                      title="Copier tout l'email (Ctrl+Enter)"
                    >
                      <Copy className="h-5 w-5 mr-2" />
                      {copySuccess ? t.copied : (t.copyAll || 'Tout')}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="flex items-center justify-center h-80">
                  <div className="text-center">
                    <div className="relative mb-6">
                      <FileText className="h-16 w-16 text-gray-300 mx-auto animate-bounce" />
                      <Sparkles className="h-6 w-6 text-blue-400 absolute -top-2 -right-2 animate-pulse" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">{t.noTemplate}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
        </>
      )}
    </div>
  )
}

export default App

