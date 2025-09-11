import { useState, useEffect, useMemo, useRef } from 'react'
import { Search, FileText, Copy, RotateCcw, Languages, Filter, Globe, Sparkles, Mail, Edit3, Link, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import './App.css'

function App() {
  // États principaux
  const [templatesData, setTemplatesData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [interfaceLanguage, setInterfaceLanguage] = useState('fr')
  const [templateLanguage, setTemplateLanguage] = useState('fr')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [finalSubject, setFinalSubject] = useState('')
  const [finalBody, setFinalBody] = useState('')
  const [variables, setVariables] = useState({})
  const [copySuccess, setCopySuccess] = useState(false)
  const [linkCopySuccess, setLinkCopySuccess] = useState(false)

  // Textes de l'interface
  const interfaceTexts = {
    fr: {
      title: 'Assistant pour rédaction de courriels aux clients',
      subtitle: 'Bureau de la traduction',
      selectTemplate: 'Sélectionnez un modèle',
      templatesCount: (count) => `${count} modèles disponibles`,
      searchPlaceholder: '🔍 Rechercher un modèle...',
      allCategories: 'Toutes les catégories',
      templateLanguage: 'Langue du modèle',
      interfaceLanguage: 'Langue de l\'interface',
      variables: 'Variables',
      subject: 'Objet',
      body: 'Corps du message',
      copySubject: 'Copier l\'objet',
      copyBody: 'Copier le corps',
      copyAll: 'Copier tout',
      copyLink: 'Copier le lien',
      copied: 'Copié !',
      linkCopied: 'Lien copié !',
      reset: 'Réinitialiser',
      noTemplate: 'Sélectionnez un modèle pour commencer',
      valid: 'Valide',
      invalid: 'Non valide',
      categories: {
        'Devis et estimations': 'Devis et estimations',
        'Gestion de projets': 'Gestion de projets',
        'Problèmes techniques': 'Problèmes techniques',
        'Communications générales': 'Communications générales',
        'Services spécialisés': 'Services spécialisés'
      }
    },
    en: {
      title: 'Email Writing Assistant for Clients',
      subtitle: 'Translation Bureau',
      selectTemplate: 'Select a template',
      templatesCount: (count) => `${count} templates available`,
      searchPlaceholder: '🔍 Search for a template...',
      allCategories: 'All categories',
      templateLanguage: 'Template language',
      interfaceLanguage: 'Interface language',
      variables: 'Variables',
      subject: 'Subject',
      body: 'Message body',
      copySubject: 'Copy subject',
      copyBody: 'Copy body',
      copyAll: 'Copy all',
      copyLink: 'Copy link',
      copied: 'Copied!',
      linkCopied: 'Link copied!',
      reset: 'Reset',
      noTemplate: 'Select a template to get started',
      valid: 'Valid',
      invalid: 'Invalid',
      categories: {
        'Devis et estimations': 'Quotes and estimates',
        'Gestion de projets': 'Project management',
        'Problèmes techniques': 'Technical issues',
        'Communications générales': 'General communications',
        'Services spécialisés': 'Specialized services'
      }
    }
  }

  const t = interfaceTexts[interfaceLanguage]

  // Chargement des données
  useEffect(() => {
    const loadTemplatesData = async () => {
      try {
        const response = await fetch('./complete_email_templates.json')
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

  // Filtrage des modèles
  const filteredTemplates = useMemo(() => {
    if (!templatesData) return []
    let filtered = templatesData.templates

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(template => 
        template.title[templateLanguage]?.toLowerCase().includes(query) ||
        template.description[templateLanguage]?.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    return filtered
  }, [templatesData, searchQuery, selectedCategory, templateLanguage])

  // Catégories uniques
  const categories = useMemo(() => {
    if (!templatesData) return []
    return [...new Set(templatesData.templates.map(t => t.category))]
  }, [templatesData])

  // Remplacer les variables
  const replaceVariables = (text) => {
    let result = text
    Object.entries(variables).forEach(([varName, value]) => {
      const regex = new RegExp(`<<${varName}>>`, 'g')
      result = result.replace(regex, value || `<<${varName}>>`)
    })
    return result
  }

  // Charger un modèle sélectionné
  useEffect(() => {
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
  }, [selectedTemplate, templateLanguage])

  // Mettre à jour quand les variables changent
  useEffect(() => {
    if (selectedTemplate) {
      const subjectWithVars = replaceVariables(selectedTemplate.subject[templateLanguage] || '')
      const bodyWithVars = replaceVariables(selectedTemplate.body[templateLanguage] || '')
      setFinalSubject(subjectWithVars)
      setFinalBody(bodyWithVars)
    }
  }, [variables, selectedTemplate, templateLanguage])

  // Fonction de copie
  const copyToClipboard = async (type = 'all') => {
    let content = ''
    
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
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content)
      } else {
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
      
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Copy error:', error)
      alert('Erreur lors de la copie.')
    }
  }

  // Copier le lien profond
  const copyDeepLink = async () => {
    if (!selectedTemplate) return
    
    const baseUrl = window.location.origin + window.location.pathname
    const params = new URLSearchParams()
    params.set('id', selectedTemplate.id)
    params.set('lang', templateLanguage)
    
    const deepLink = `${baseUrl}?${params.toString()}`
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(deepLink)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = deepLink
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      
      setLinkCopySuccess(true)
      setTimeout(() => setLinkCopySuccess(false), 2000)
    } catch (error) {
      console.error('Link copy error:', error)
      alert('Erreur lors de la copie du lien.')
    }
  }

  // Réinitialiser
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
    }
  }

  // Validation des variables
  const validateVariable = (varName, value) => {
    if (!value || value.trim() === '') return { isValid: false, message: 'Champ requis' }
    
    const varInfo = templatesData?.variables?.[varName]
    if (!varInfo) return { isValid: true, message: '' }
    
    switch (varInfo.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return {
          isValid: emailRegex.test(value),
          message: emailRegex.test(value) ? '' : 'Format email invalide'
        }
      case 'phone':
        const phoneRegex = /^[\d\s\-\+\(\)]+$/
        return {
          isValid: phoneRegex.test(value) && value.length >= 10,
          message: phoneRegex.test(value) && value.length >= 10 ? '' : 'Format téléphone invalide'
        }
      case 'number':
        const isNumber = !isNaN(value) && !isNaN(parseFloat(value))
        return {
          isValid: isNumber,
          message: isNumber ? '' : 'Doit être un nombre'
        }
      case 'date':
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        return {
          isValid: dateRegex.test(value),
          message: dateRegex.test(value) ? '' : 'Format date invalide (YYYY-MM-DD)'
        }
      case 'time':
        const timeRegex = /^\d{2}:\d{2}$/
        return {
          isValid: timeRegex.test(value),
          message: timeRegex.test(value) ? '' : 'Format heure invalide (HH:MM)'
        }
      default:
        return { isValid: true, message: '' }
    }
  }

  // Composant d'input selon le type
  const getVariableInput = (varName, varInfo) => {
    const value = variables[varName] || ''
    const onChange = (newValue) => setVariables(prev => ({ ...prev, [varName]: newValue }))
    const validation = validateVariable(varName, value)
    
    // Couleurs par type
    const getVariableColor = (type) => {
      const colors = {
        email: 'border-blue-300 focus:border-blue-500 bg-blue-50 focus:ring-blue-200',
        phone: 'border-green-300 focus:border-green-500 bg-green-50 focus:ring-green-200',
        date: 'border-purple-300 focus:border-purple-500 bg-purple-50 focus:ring-purple-200',
        time: 'border-orange-300 focus:border-orange-500 bg-orange-50 focus:ring-orange-200',
        number: 'border-amber-300 focus:border-amber-500 bg-amber-50 focus:ring-amber-200',
        text: 'border-gray-300 focus:border-gray-500 bg-gray-50 focus:ring-gray-200',
        default: 'border-indigo-300 focus:border-indigo-500 bg-indigo-50 focus:ring-indigo-200'
      }
      return colors[type] || colors.default
    }
    
    const colorClasses = getVariableColor(varInfo.type)
    const validationClasses = validation.isValid ? 'border-solid' : 'border-red-400 bg-red-50'
    
    const inputComponent = (() => {
      switch (varInfo.type) {
        case 'date':
          return (
            <div className="flex space-x-2">
              <Input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`border-2 ${colorClasses} ${validationClasses} focus:ring-2 transition-all duration-300`}
              />
              <Calendar className="h-5 w-5 text-purple-500 mt-2 flex-shrink-0" />
            </div>
          )
        case 'time':
          return (
            <div className="flex space-x-2">
              <Input
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`border-2 ${colorClasses} ${validationClasses} focus:ring-2 transition-all duration-300`}
              />
              <Clock className="h-5 w-5 text-orange-500 mt-2 flex-shrink-0" />
            </div>
          )
        case 'number':
          return (
            <Input
              type="number"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={varInfo.example}
              className={`border-2 ${colorClasses} ${validationClasses} focus:ring-2 transition-all duration-300`}
            />
          )
        case 'email':
          return (
            <Input
              type="email"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={varInfo.example}
              className={`border-2 ${colorClasses} ${validationClasses} focus:ring-2 transition-all duration-300`}
            />
          )
        case 'phone':
          return (
            <Input
              type="tel"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={varInfo.example}
              className={`border-2 ${colorClasses} ${validationClasses} focus:ring-2 transition-all duration-300`}
            />
          )
        default:
          return (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={varInfo.example}
              className={`border-2 ${colorClasses} ${validationClasses} focus:ring-2 transition-all duration-300`}
            />
          )
      }
    })()

    return (
      <div className="space-y-1">
        {inputComponent}
        <div className="flex items-center space-x-2 text-xs">
          {validation.isValid ? (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span className="font-medium">{t.valid}</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <XCircle className="h-3 w-3 mr-1" />
              <span className="font-medium">{t.invalid}</span>
              {validation.message && <span className="ml-1">- {validation.message}</span>}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des modèles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* En-tête */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Mail className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">{t.title}</h1>
                <p className="text-blue-100">{t.subtitle}</p>
              </div>
            </div>
            
            {/* Sélecteur de langue */}
            <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-2">
              <Globe className="h-5 w-5" />
              <span className="text-sm font-medium">{t.interfaceLanguage}:</span>
              <div className="flex bg-white/20 rounded-lg p-1">
                <button
                  onClick={() => setInterfaceLanguage('fr')}
                  className={`px-3 py-1 text-sm font-bold rounded-md transition-all duration-300 ${
                    interfaceLanguage === 'fr'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setInterfaceLanguage('en')}
                  className={`px-3 py-1 text-sm font-bold rounded-md transition-all duration-300 ${
                    interfaceLanguage === 'en'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white/80 hover:bg-white/10'
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
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Panneau gauche - Sélection des modèles */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-blue-600" />
                  {t.selectTemplate}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {typeof t.templatesCount === 'function' 
                    ? t.templatesCount(filteredTemplates.length)
                    : `${filteredTemplates.length} ${t.templatesCount}`}
                </p>

                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                  />
                </div>

                {/* Filtre par catégorie */}
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

                {/* Langue des modèles */}
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
                              {t.categories[template.category] || template.category}
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

          {/* Panneau droit - Variables et Édition */}
          <div className="lg:col-span-2 space-y-6">
            {selectedTemplate ? (
              <>
                {/* Section Variables */}
                {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-orange-50 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                        <Edit3 className="h-6 w-6 mr-2 text-orange-600" />
                        {t.variables}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedTemplate.variables.map((varName) => {
                          const varInfo = templatesData.variables[varName]
                          if (!varInfo) return null
                          
                          return (
                            <div key={varName} className="space-y-2">
                              <label className="text-sm font-bold text-gray-700 flex items-center">
                                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                                {varInfo.description[interfaceLanguage]}
                              </label>
                              {getVariableInput(varName, varInfo)}
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Contenu Email Éditable */}
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-green-50 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                      <Sparkles className="h-6 w-6 mr-2 text-green-600" />
                      Éditez votre email
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Objet */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {t.subject}
                      </label>
                      <Textarea
                        value={finalSubject}
                        onChange={(e) => setFinalSubject(e.target.value)}
                        className="border-2 border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-300 min-h-[60px]"
                        placeholder={t.subject}
                      />
                    </div>

                    {/* Corps */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {t.body}
                      </label>
                      <Textarea
                        value={finalBody}
                        onChange={(e) => setFinalBody(e.target.value)}
                        className="border-2 border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-300 min-h-[200px]"
                        placeholder={t.body}
                      />
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                      {/* Bouton Lien - À gauche */}
                      <div className="flex-shrink-0">
                        <Button 
                          onClick={copyDeepLink}
                          variant="outline"
                          className={`font-medium px-4 py-2 border-2 transition-all duration-300 ${
                            linkCopySuccess
                              ? 'border-green-300 bg-green-50 text-green-700'
                              : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50'
                          }`}
                        >
                          <Link className="h-4 w-4 mr-2" />
                          {linkCopySuccess ? t.linkCopied : t.copyLink}
                        </Button>
                      </div>

                      {/* Séparateur */}
                      <div className="border-l border-gray-300 h-10"></div>

                      {/* Bouton Réinitialiser */}
                      <Button 
                        onClick={resetForm}
                        variant="outline"
                        className="font-medium px-4 py-2 border-2 border-gray-300 hover:border-gray-500 hover:bg-gray-50 transition-all duration-300"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        {t.reset}
                      </Button>

                      {/* Bouton Copier Objet */}
                      <Button 
                        onClick={() => copyToClipboard('subject')} 
                        variant="outline"
                        className="font-medium px-4 py-2 border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
                      >
                        <Mail className="h-4 w-4 mr-2 group-hover:text-blue-600" />
                        {t.copySubject}
                      </Button>
                      
                      {/* Bouton Copier Corps */}
                      <Button 
                        onClick={() => copyToClipboard('body')} 
                        variant="outline"
                        className="font-medium px-4 py-2 border-2 border-green-300 hover:border-green-500 hover:bg-green-50 transition-all duration-300 group"
                      >
                        <Edit3 className="h-4 w-4 mr-2 group-hover:text-green-600" />
                        {t.copyBody}
                      </Button>
                      
                      {/* Bouton Copier Tout */}
                      <Button 
                        onClick={() => copyToClipboard('all')} 
                        className={`font-bold px-6 py-3 transition-all duration-300 shadow-lg ${
                          copySuccess 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform scale-105' 
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105'
                        }`}
                      >
                        <Copy className="h-5 w-5 mr-2" />
                        {copySuccess ? t.copied : t.copyAll}
                      </Button>
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
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">{t.noTemplate}</h3>
                    <p className="text-gray-500">Choisissez un modèle dans la liste de gauche pour commencer à rédiger votre email.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

