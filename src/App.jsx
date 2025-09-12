/**
 * 🎯 EMAIL ASSISTANT - VERSION COMPLÈTE INTÉGRÉE
 * 
 * Application React pour l'assistance à la rédaction d'emails clients
 * Bureau de la traduction - Gouvernement du Canada
 * 
 * FONCTIONNALITÉS INTÉGRÉES:
 * ✅ Copie granulaire (objet, corps, tout)
 * ✅ Lien profond avec partage d'URL
 * ✅ Validation intelligente des variables
 * ✅ Surlignement par code couleur selon le type
 * ✅ Sélecteurs de dates et heures fonctionnels
 * ✅ Interface bilingue (FR/EN)
 * ✅ Raccourcis clavier
 * ✅ Design élégant et cohérent
 * 
 * @author Bureau de la traduction
 * @version 2.0 - Version complète intégrée
 */

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { loadState, saveState } from '@/utils/storage'
import { Search, FileText, Copy, RotateCcw, Languages, Filter, Globe, Sparkles, Mail, Edit3, Link, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Calendar as CalendarComponent } from '@/components/ui/calendar.jsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.jsx'
import { format } from 'date-fns'
import { fr, enUS } from 'date-fns/locale'
import './App.css'

function App() {
  // Charger l'état sauvegardé
  const savedState = loadState()
  
  // État pour les données des templates
  const [templatesData, setTemplatesData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Séparer la langue de l'interface de la langue des modèles
  const [interfaceLanguage, setInterfaceLanguage] = useState(savedState.interfaceLanguage || 'fr')
  const [templateLanguage, setTemplateLanguage] = useState(savedState.templateLanguage || 'fr')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [searchQuery, setSearchQuery] = useState(savedState.searchQuery || '')
  const [selectedCategory, setSelectedCategory] = useState(savedState.selectedCategory || 'all')
  const [finalSubject, setFinalSubject] = useState('')
  const [finalBody, setFinalBody] = useState('')
  const [variables, setVariables] = useState(savedState.variables || {})
  const [copySuccess, setCopySuccess] = useState(false)
  const [showPreview, setShowPreview] = useState(true) // Toggle pour l'aperçu
  
  // 🎯 RÉFÉRENCES POUR LES RACCOURCIS CLAVIER
  const searchRef = useRef(null)

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
      copyLink: 'Copier le lien',
      copied: 'Copié !',
      noTemplate: 'Sélectionnez un modèle pour commencer',
      preview: 'Aperçu',
      hidePreview: 'Masquer l\'aperçu',
      showPreview: 'Afficher l\'aperçu',
      validation: {
        valid: 'Valide',
        required: 'Requis',
        invalidEmail: 'Email invalide',
        invalidPhone: 'Téléphone invalide',
        invalidDate: 'Date invalide',
        invalidNumber: 'Nombre invalide'
      }
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
      copyLink: 'Copy link',
      copied: 'Copied!',
      noTemplate: 'Select a template to start',
      preview: 'Preview',
      hidePreview: 'Hide preview',
      showPreview: 'Show preview',
      validation: {
        valid: 'Valid',
        required: 'Required',
        invalidEmail: 'Invalid email',
        invalidPhone: 'Invalid phone',
        invalidDate: 'Invalid date',
        invalidNumber: 'Invalid number'
      }
    }
  }

  const t = interfaceTexts[interfaceLanguage]

  // Charger les données des templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch('./complete_email_templates.json')
        const data = await response.json()
        setTemplatesData(data)
        
        // Gérer les paramètres URL pour les liens profonds
        const urlParams = new URLSearchParams(window.location.search)
        const templateId = urlParams.get('id')
        const langParam = urlParams.get('lang')
        
        if (templateId) {
          const template = data.templates.find(t => t.id === templateId)
          if (template) {
            setSelectedTemplate(template)
            if (langParam && ['fr', 'en'].includes(langParam)) {
              setTemplateLanguage(langParam)
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des templates:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadTemplates()
  }, [])

  // 🎯 RACCOURCIS CLAVIER GLOBAUX
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+J : Focus sur la recherche
      if (e.ctrlKey && e.key === 'j') {
        e.preventDefault()
        searchRef.current?.focus()
      }
      
      // Ctrl+Enter : Copier tout
      if (e.ctrlKey && e.key === 'Enter' && selectedTemplate) {
        e.preventDefault()
        copyToClipboard('all')
      }
      
      // Ctrl+B : Copier le corps
      if (e.ctrlKey && e.key === 'b' && selectedTemplate) {
        e.preventDefault()
        copyToClipboard('body')
      }
      
      // Ctrl+Shift+S : Copier l'objet
      if (e.ctrlKey && e.shiftKey && e.key === 'S' && selectedTemplate) {
        e.preventDefault()
        copyToClipboard('subject')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedTemplate])

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
   * 🎨 FONCTION DE SURLIGNAGE DES VARIABLES - VERSION ÉLÉGANTE
   * 
   * Applique un surlignage doux et discret aux variables dans le texte
   * Utilise des couleurs cohérentes selon le type de variable
   * 
   * @param {string} text - Texte contenant des variables au format <<variable>>
   * @returns {JSX.Element[]} - Tableau d'éléments React avec surlignage
   */
  const highlightVariables = (text) => {
    if (!text) return text
    
    // 🎨 PALETTE DE COULEURS ÉLÉGANTES
    const VARIABLE_COLORS = {
      email: 'bg-blue-50 text-blue-700 border-blue-200',
      phone: 'bg-green-50 text-green-700 border-green-200',
      date: 'bg-purple-50 text-purple-700 border-purple-200',
      time: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      number: 'bg-amber-50 text-amber-700 border-amber-200',
      text: 'bg-gray-50 text-gray-700 border-gray-200',
      default: 'bg-slate-50 text-slate-700 border-slate-200'
    }
    
    const BASE_CLASSES = 'inline px-1.5 py-0.5 rounded text-xs font-medium border transition-all duration-200'
    
    const getVariableColor = (variableName) => {
      const variableInfo = templatesData?.variables?.[variableName]
      if (!variableInfo) return VARIABLE_COLORS.default
      return VARIABLE_COLORS[variableInfo.type] || VARIABLE_COLORS.default
    }
    
    const textParts = text.split(/(<<[^>]+>>)/g)
    
    return textParts.map((part, index) => {
      const variableMatch = part.match(/^<<([^>]+)>>$/)
      
      if (variableMatch) {
        const variableName = variableMatch[1]
        const value = variables[variableName]
        const colorClasses = getVariableColor(variableName)
        
        return (
          <span
            key={index}
            className={`${BASE_CLASSES} ${colorClasses} hover:scale-105`}
            title={`Variable: ${variableName}`}
          >
            {value || `<<${variableName}>>`}
          </span>
        )
      }
      
      return <span key={index}>{part}</span>
    })
  }

  /**
   * 🎯 VALIDATION INTELLIGENTE DES VARIABLES
   * 
   * Valide les variables selon leur type avec messages en français
   * 
   * @param {string} varName - Nom de la variable
   * @param {string} value - Valeur à valider
   * @returns {Object} - {valid: boolean, message: string}
   */
  const validateVariable = (varName, value) => {
    if (!templatesData?.variables?.[varName]) {
      return { valid: true, message: t.validation.valid }
    }

    const varInfo = templatesData.variables[varName]
    const isEmpty = !value || value.trim() === ''

    if (varInfo.required && isEmpty) {
      return { valid: false, message: t.validation.required }
    }

    if (isEmpty) {
      return { valid: true, message: t.validation.valid }
    }

    switch (varInfo.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value) 
          ? { valid: true, message: t.validation.valid }
          : { valid: false, message: t.validation.invalidEmail }
      
      case 'phone':
        const phoneRegex = /^[\d\s\-\+\(\)\.]{10,}$/
        return phoneRegex.test(value.replace(/\s/g, ''))
          ? { valid: true, message: t.validation.valid }
          : { valid: false, message: t.validation.invalidPhone }
      
      case 'date':
        const dateValue = new Date(value)
        return !isNaN(dateValue.getTime())
          ? { valid: true, message: t.validation.valid }
          : { valid: false, message: t.validation.invalidDate }
      
      case 'number':
        return !isNaN(parseFloat(value))
          ? { valid: true, message: t.validation.valid }
          : { valid: false, message: t.validation.invalidNumber }
      
      default:
        return { valid: true, message: t.validation.valid }
    }
  }

  /**
   * 📋 FONCTION DE COPIE GRANULAIRE
   * 
   * Copie différentes parties de l'email selon le type demandé
   * 
   * @param {string} type - 'subject', 'body', ou 'all'
   */
  const copyToClipboard = async (type) => {
    if (!selectedTemplate) return

    let textToCopy = ''
    
    switch (type) {
      case 'subject':
        textToCopy = finalSubject
        break
      case 'body':
        textToCopy = finalBody
        break
      case 'all':
        textToCopy = `Objet: ${finalSubject}\n\n${finalBody}`
        break
      default:
        return
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = textToCopy
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Erreur lors de la copie:', error)
      alert('Erreur lors de la copie. Veuillez sélectionner le texte manuellement et utiliser Ctrl+C.')
    }
  }

  /**
   * 🔗 FONCTION DE COPIE DE LIEN PROFOND
   * 
   * Génère et copie l'URL complète pour accéder directement à ce template
   */
  const copyTemplateLink = async () => {
    if (!selectedTemplate) return
    
    const currentUrl = window.location.origin + window.location.pathname
    const templateUrl = `${currentUrl}?id=${selectedTemplate.id}&lang=${templateLanguage}`
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(templateUrl)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = templateUrl
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Erreur lors de la copie du lien:', error)
      alert('Erreur lors de la copie du lien.')
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
      
      const subjectWithVars = replaceVariables(selectedTemplate.subject[templateLanguage] || '')
      const bodyWithVars = replaceVariables(selectedTemplate.body[templateLanguage] || '')
      setFinalSubject(subjectWithVars)
      setFinalBody(bodyWithVars)
    }
  }

  // Mettre à jour les versions finales quand les variables changent
  useEffect(() => {
    if (selectedTemplate) {
      const subjectWithVars = replaceVariables(selectedTemplate.subject[templateLanguage] || '')
      const bodyWithVars = replaceVariables(selectedTemplate.body[templateLanguage] || '')
      setFinalSubject(subjectWithVars)
      setFinalBody(bodyWithVars)
    }
  }, [selectedTemplate, variables, templateLanguage])

  /**
   * 🗓️ COMPOSANT SÉLECTEUR DE DATE
   * 
   * Sélecteur de date élégant avec calendrier popup
   */
  const DatePicker = ({ value, onChange, placeholder }) => {
    const [date, setDate] = useState(value ? new Date(value) : undefined)
    const locale = interfaceLanguage === 'fr' ? fr : enUS

    const handleDateSelect = (selectedDate) => {
      setDate(selectedDate)
      if (selectedDate) {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd', { locale })
        onChange(formattedDate)
      } else {
        onChange('')
      }
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal h-8 text-sm"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP', { locale }) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            locale={locale}
          />
        </PopoverContent>
      </Popover>
    )
  }

  /**
   * 🕐 COMPOSANT SÉLECTEUR D'HEURE
   * 
   * Sélecteur d'heure avec interface intuitive
   */
  const TimePicker = ({ value, onChange, placeholder }) => {
    const [time, setTime] = useState(value || '')

    const handleTimeChange = (newTime) => {
      setTime(newTime)
      onChange(newTime)
    }

    return (
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-gray-500" />
        <Input
          type="time"
          value={time}
          onChange={(e) => handleTimeChange(e.target.value)}
          placeholder={placeholder}
          className="h-8 text-sm"
        />
      </div>
    )
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
          {/* En-tête élégant */}
          <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Mail className="h-10 w-10 text-white animate-pulse" />
                    <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-bounce" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{t.title}</h1>
                    <p className="text-blue-100 text-lg">{t.subtitle}</p>
                  </div>
                </div>
                
                {/* Sélecteurs de langue */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-white" />
                    <Select value={interfaceLanguage} onValueChange={setInterfaceLanguage}>
                      <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Languages className="h-5 w-5 text-white" />
                    <Select value={templateLanguage} onValueChange={setTemplateLanguage}>
                      <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Contenu principal */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Panneau de sélection des templates */}
              <div className="lg:col-span-1">
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 sticky top-8">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                      <FileText className="h-6 w-6 mr-3 text-blue-600" />
                      {t.selectTemplate}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {filteredTemplates.length} {t.templatesCount}
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    
                    {/* Barre de recherche */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        ref={searchRef}
                        placeholder={t.searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-10 border-2 border-gray-200 focus:border-blue-400 transition-all duration-300"
                      />
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
                        >
                          ×
                        </Button>
                      )}
                    </div>

                    {/* Filtre par catégorie */}
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-10 border-2 border-gray-200 focus:border-blue-400">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
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

                    {/* Liste des templates */}
                    <ScrollArea className="h-96">
                      <div className="space-y-2">
                        {filteredTemplates.map(template => (
                          <Card
                            key={template.id}
                            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                              selectedTemplate?.id === template.id
                                ? 'ring-2 ring-blue-500 bg-blue-50'
                                : 'hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedTemplate(template)}
                          >
                            <CardContent className="p-3">
                              <h3 className="font-semibold text-sm text-gray-800 mb-1">
                                {template.title[templateLanguage]}
                              </h3>
                              <p className="text-xs text-gray-600 mb-2">
                                {template.description[templateLanguage]}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {t.categories[template.category] || template.category}
                              </Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Panneau principal d'édition */}
              <div className="lg:col-span-2 space-y-6">
                
                {selectedTemplate ? (
                  <>
                    {/* Variables */}
                    {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                      <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-orange-50">
                        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
                          <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                            <Edit3 className="h-6 w-6 mr-3 text-orange-600" />
                            {t.variables}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedTemplate.variables.map(varName => {
                              const varInfo = templatesData.variables[varName]
                              if (!varInfo) return null

                              const currentValue = variables[varName] || ''
                              const validation = validateVariable(varName, currentValue)
                              
                              // Couleur selon le type de variable
                              const getTypeColor = () => {
                                switch (varInfo.type) {
                                  case 'email': return 'border-blue-300 focus:border-blue-500'
                                  case 'phone': return 'border-green-300 focus:border-green-500'
                                  case 'date': return 'border-purple-300 focus:border-purple-500'
                                  case 'time': return 'border-indigo-300 focus:border-indigo-500'
                                  case 'number': return 'border-amber-300 focus:border-amber-500'
                                  default: return 'border-gray-300 focus:border-gray-500'
                                }
                              }
                              
                              return (
                                <div key={varName} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-300 transition-all duration-200">
                                  {/* En-tête avec indicateur de type */}
                                  <div className="flex items-center justify-between mb-3">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                                      <span className={`w-2 h-2 rounded-full mr-2 ${
                                        varInfo.type === 'email' ? 'bg-blue-400' :
                                        varInfo.type === 'phone' ? 'bg-green-400' :
                                        varInfo.type === 'date' ? 'bg-purple-400' :
                                        varInfo.type === 'time' ? 'bg-indigo-400' :
                                        varInfo.type === 'number' ? 'bg-amber-400' :
                                        'bg-gray-400'
                                      }`}></span>
                                      {varInfo.description[interfaceLanguage]}
                                    </label>
                                    
                                    <Badge variant="outline" className="text-xs px-2 py-1">
                                      {varInfo.type}
                                    </Badge>
                                  </div>
                                  
                                  {/* Champ de saisie selon le type */}
                                  {varInfo.type === 'date' ? (
                                    <DatePicker
                                      value={currentValue}
                                      onChange={(value) => setVariables(prev => ({
                                        ...prev,
                                        [varName]: value
                                      }))}
                                      placeholder={varInfo.example}
                                    />
                                  ) : varInfo.type === 'time' ? (
                                    <TimePicker
                                      value={currentValue}
                                      onChange={(value) => setVariables(prev => ({
                                        ...prev,
                                        [varName]: value
                                      }))}
                                      placeholder={varInfo.example}
                                    />
                                  ) : (
                                    <Input
                                      type={varInfo.type === 'email' ? 'email' : varInfo.type === 'number' ? 'number' : 'text'}
                                      value={currentValue}
                                      onChange={(e) => setVariables(prev => ({
                                        ...prev,
                                        [varName]: e.target.value
                                      }))}
                                      placeholder={varInfo.example}
                                      className={`text-sm h-9 border-2 transition-all duration-200 ${getTypeColor()} ${
                                        !validation.valid && currentValue ? 'border-red-300 focus:border-red-500' : ''
                                      }`}
                                    />
                                  )}
                                  
                                  {/* Indicateur de validation */}
                                  <div className="flex items-center justify-between mt-2">
                                    <div className={`text-xs flex items-center ${
                                      validation.valid ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                        validation.valid ? 'bg-green-400' : 'bg-red-400'
                                      }`}></span>
                                      {validation.message}
                                    </div>
                                    
                                    {/* Compteur de caractères */}
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

                    {/* Zone d'édition principale */}
                    <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-green-50">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                            <Mail className="h-7 w-7 mr-3 text-green-600" />
                            {t.editEmail}
                          </CardTitle>
                          
                          {/* Toggle aperçu */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPreview(!showPreview)}
                            className="text-sm"
                          >
                            {showPreview ? t.hidePreview : t.showPreview}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-6">
                        
                        {/* Aperçu avec surbrillance (optionnel) */}
                        {showPreview && (
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
                            <h4 className="text-sm font-bold text-blue-800 mb-3 flex items-center">
                              <Sparkles className="h-4 w-4 mr-2" />
                              {t.preview}
                            </h4>
                            
                            <div className="space-y-3">
                              <div>
                                <div className="text-xs font-semibold text-blue-700 mb-1">OBJET:</div>
                                <div className="text-sm leading-relaxed">
                                  {highlightVariables(selectedTemplate.subject[templateLanguage] || '')}
                                </div>
                              </div>
                              
                              <Separator className="bg-blue-200" />
                              
                              <div>
                                <div className="text-xs font-semibold text-blue-700 mb-1">CORPS:</div>
                                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                  {highlightVariables(selectedTemplate.body[templateLanguage] || '')}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Champs d'édition */}
                        <div className="space-y-4">
                          {/* Objet */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              {t.subject}
                            </label>
                            <Input
                              value={finalSubject}
                              onChange={(e) => setFinalSubject(e.target.value)}
                              className="text-sm h-10 border-2 border-gray-200 focus:border-green-400 transition-all duration-300"
                              placeholder={t.subject}
                            />
                          </div>
                          
                          {/* Corps */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              {t.body}
                            </label>
                            <Textarea
                              value={finalBody}
                              onChange={(e) => setFinalBody(e.target.value)}
                              rows={12}
                              className="text-sm border-2 border-gray-200 focus:border-green-400 transition-all duration-300 resize-none"
                              placeholder={t.body}
                            />
                          </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
                          
                          {/* Bouton copie de lien */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyTemplateLink()}
                            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium text-sm"
                            title="Copier le lien direct vers ce template"
                          >
                            <Link className="h-4 w-4 mr-2" />
                            {t.copyLink}
                          </Button>
                          
                          <div className="flex flex-wrap items-center gap-3">
                            {/* Bouton reset */}
                            <Button 
                              variant="outline" 
                              onClick={resetForm}
                              className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              {t.reset}
                            </Button>
                          
                            {/* Boutons de copie granulaire */}
                            <div className="flex gap-2">
                              {/* Copie Objet */}
                              <Button 
                                onClick={() => copyToClipboard('subject')} 
                                variant="outline"
                                size="sm"
                                className="font-medium px-3 py-2 border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                                title="Copier l'objet seulement (Ctrl+Shift+S)"
                              >
                                <Mail className="h-4 w-4 mr-1 group-hover:text-blue-600" />
                                {t.copySubject}
                              </Button>
                              
                              {/* Copie Corps */}
                              <Button 
                                onClick={() => copyToClipboard('body')} 
                                variant="outline"
                                size="sm"
                                className="font-medium px-3 py-2 border-2 border-green-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300 group"
                                title="Copier le corps seulement (Ctrl+B)"
                              >
                                <Edit3 className="h-4 w-4 mr-1 group-hover:text-green-600" />
                                {t.copyBody}
                              </Button>
                              
                              {/* Copie Complète */}
                              <Button 
                                onClick={() => copyToClipboard('all')} 
                                className={`font-bold px-4 py-2 transition-all duration-300 shadow-lg ${
                                  copySuccess 
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform scale-105' 
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105'
                                }`}
                                title="Copier tout l'email (Ctrl+Enter)"
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                {copySuccess ? t.copied : t.copyAll}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
