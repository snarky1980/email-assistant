import { useState, useEffect } from 'react'

function App() {
  const [loading, setLoading] = useState(true)
  const [templatesData, setTemplatesData] = useState(null)

  useEffect(() => {
    const loadTemplatesData = async () => {
      try {
        console.log('Tentative de chargement des templates...')
        const response = await fetch('/email-assistant/complete_email_templates.json')
        console.log('Response status:', response.status)
        if (!response.ok) {
          throw new Error('Failed to load templates data')
        }
        const data = await response.json()
        console.log('Templates loaded:', data.metadata)
        setTemplatesData(data)
      } catch (error) {
        console.error('Error loading templates data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadTemplatesData()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Assistant Email - Chargement...</h1>
        <div>Chargement des modèles...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Assistant pour rédaction de courriels aux clients</h1>
      <p>Bureau de la traduction</p>
      
      {templatesData ? (
        <div>
          <p>✅ Templates chargés: {templatesData.metadata.totalTemplates} modèles</p>
          <p>Langues disponibles: {templatesData.metadata.languages.join(', ')}</p>
          <p>Catégories: {templatesData.metadata.categories.length}</p>
        </div>
      ) : (
        <div>❌ Erreur de chargement des templates</div>
      )}
    </div>
  )
}

export default App

