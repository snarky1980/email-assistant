import { useState, useEffect, useMemo, useRef } from 'react'
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

  const searchRef = useRef(null);

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
      title: "Assistant pour rédaction de courriels aux clients",
      subtitle: "Bureau de la traduction",
      searchPlaceholder: "🔍 Rechercher un modèle...",
      allCategories: "Toutes les catégories",
      selectTemplate: "Sélectionnez un modèle",
      templateLanguage: "Langue du modèle",
      interfaceLanguage: "Langue de l'interface",
      variables: "Variables",
      subject: "Objet",
      body: "Corps du message",
      emailContent: "Contenu de l'email",
      editableVersion: "✏️ Éditez votre email",
      copy: "Copier",
      copySubject: "Copier Objet",
      copyBody: "Copier Corps", 
      copyAll: "Copier Tout",
      copyLink: "Copier le lien",
      reset: "Réinitialiser",
      copied: "✅ Email copié !",
      noTemplate: "Sélectionnez un modèle pour commencer",
      templatesCount: "modèles disponibles"
    },
    en: {
      title: "Email Writing Assistant for Clients",
      subtitle: "Translation Bureau",
      searchPlaceholder: "🔍 Search for a template...",
      allCategories: "All categories",
      selectTemplate: "Select a template",
      templateLanguage: "Template language",
      interfaceLanguage: "Interface language",
      variables: "Variables",
      subject: "Subject",
      body: "Message body",
      emailContent: "Email content",
      editableVersion: "✏️ Edit your email",
      copy: "Copy",
      copySubject: "Copy Subject",
      copyBody: "Copy Body",
      copyAll: "Copy All", 
      copyLink: "Copy Link",
      reset: "Reset",
      copied: "✅ Email copied!",
      noTemplate: "Select a template to get started",
      templatesCount: "templates available"
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

  // Copier le contenu dans le presse-papiers
  const copyToClipboard = async () => {
    const fullEmail = `${finalSubject}\n\n${finalBody}`
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullEmail)
      } else {
        // Fallback pour les navigateurs plus anciens ou contextes non sécurisés
        const textArea = document.createElement('textarea')
        textArea.value = fullEmail
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
      setTimeout(() => setCopySuccess(false), 3000)
    } catch (error) {
      console.error('Erreur lors de la copie:', error)
      // Afficher un message d'erreur à l'utilisateur
      alert('Erreur lors de la copie. Veuillez sélectionner le texte manuellement et utiliser Ctrl+C.')
    }
  }

  // Copier uniquement l'objet
  const copySubjectOnly = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(finalSubject)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = finalSubject
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
      console.error('Erreur lors de la copie de l\'objet:', error)
    }
  }

  // Copier uniquement le corps
  const copyBodyOnly = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(finalBody)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = finalBody
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
      console.error('Erreur lors de la copie du corps:', error)
    }
  }

  // Copier le lien profond
  const copyTemplateLink = async () => {
    if (!selectedTemplate) return
    
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('template', selectedTemplate.id)
    
    // Ajouter les variables si elles sont remplies
    Object.entries(variables).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        currentUrl.searchParams.set(key, value)
      }
    })
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl.toString())
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = currentUrl.toString()
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
                
                {/* Recherche avec style moderne */}
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-2 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                  />
                </div>

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
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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
                              className={`text-xs font-medium ${
                                template.category === 'Devis et estimations' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                template.category === 'Gestion de projets' ? 'bg-green-100 text-green-700 border-green-200' :
                                template.category === 'Problèmes techniques' ? 'bg-red-100 text-red-700 border-red-200' :
                                template.category === 'Communications générales' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                template.category === 'Services spécialisés' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                                'bg-gray-100 text-gray-700 border-gray-200'
                              }`}
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
                              <Input
                                value={variables[varName] || ''}
                                onChange={(e) => setVariables(prev => ({
                                  ...prev,
                                  [varName]: e.target.value
                                }))}
                                placeholder={varInfo.example}
                                className="border-2 border-orange-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-300"
                              />
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
                      {t.editableVersion}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
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
                <div className="space-y-4">
                  {/* Bouton de copie de lien profond */}
                  <div className="flex justify-center">
                    <Button 
                      variant="outline" 
                      onClick={copyTemplateLink}
                      className="border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 font-semibold text-purple-700"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {t.copyLink}
                    </Button>
                  </div>
                  
                  {/* Boutons d'action principaux */}
                  <div className="flex justify-center space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={resetForm}
                      className="border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-semibold"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {t.reset}
                    </Button>
                    
                    {/* Boutons de copie granulaire */}
                    <Button 
                      onClick={copySubjectOnly}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                    >
                      {t.copySubject}
                    </Button>
                    
                    <Button 
                      onClick={copyBodyOnly}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                    >
                      {t.copyBody}
                    </Button>
                    
                    <Button 
                      onClick={copyToClipboard} 
                      className={`font-bold px-6 py-2 transition-all duration-300 ${
                        copySuccess 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 transform scale-105' 
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:scale-105'
                      } text-white shadow-lg`}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {copySuccess ? t.copied : t.copyAll}
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

