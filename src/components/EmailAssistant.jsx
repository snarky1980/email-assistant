/**
 * EmailAssistant - Composant principal de l'assistant pour la rédaction de courriels aux clients
 * 
 * Ce composant fournit une interface utilisateur pour aider les employés du Bureau de la traduction
 * à rédiger des courriels professionnels et cohérents destinés aux clients.
 * 
 * Fonctionnalités principales:
 * - Sélection de modèles d'emails prédéfinis
 * - Personnalisation du contenu selon le contexte
 * - Prévisualisation en temps réel
 * - Génération d'emails formatés et professionnels
 * 
 * @author Bureau de la traduction
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import EmailForm from './EmailForm';
import EmailPreview from './EmailPreview';
import TemplateSelector from './TemplateSelector';
import { emailTemplates } from '../utils/emailTemplates';

const EmailAssistant = () => {
  // État pour le modèle d'email sélectionné
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    clientName: '',
    subject: '',
    customMessage: '',
    urgency: 'normal',
    language: 'fr' // Français par défaut
  });
  
  // État pour l'email généré
  const [generatedEmail, setGeneratedEmail] = useState('');
  
  // État pour l'affichage (formulaire ou prévisualisation)
  const [currentView, setCurrentView] = useState('form');

  /**
   * Gestionnaire pour la sélection d'un modèle d'email
   * @param {Object} template - Le modèle d'email sélectionné
   */
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Pré-remplir le sujet si disponible dans le modèle
    if (template.defaultSubject) {
      setFormData(prev => ({
        ...prev,
        subject: template.defaultSubject
      }));
    }
  };

  /**
   * Gestionnaire pour les changements dans le formulaire
   * @param {Object} newData - Les nouvelles données du formulaire
   */
  const handleFormChange = (newData) => {
    setFormData(prev => ({
      ...prev,
      ...newData
    }));
  };

  /**
   * Génère l'email final basé sur le modèle et les données du formulaire
   */
  const generateEmail = () => {
    if (!selectedTemplate) return;

    let emailContent = selectedTemplate.content;
    
    // Remplacer les variables dans le modèle
    emailContent = emailContent
      .replace(/\{clientName\}/g, formData.clientName || '[Nom du client]')
      .replace(/\{customMessage\}/g, formData.customMessage || '')
      .replace(/\{date\}/g, new Date().toLocaleDateString('fr-CA'));

    // Ajouter la signature selon l'urgence
    const signature = getSignatureByUrgency(formData.urgency);
    emailContent += '\n\n' + signature;

    setGeneratedEmail(emailContent);
  };

  /**
   * Retourne la signature appropriée selon le niveau d'urgence
   * @param {string} urgency - Le niveau d'urgence ('low', 'normal', 'high')
   * @returns {string} La signature formatée
   */
  const getSignatureByUrgency = (urgency) => {
    const baseSignature = `Cordialement,\n\nBureau de la traduction\nServices publics et Approvisionnement Canada`;
    
    switch (urgency) {
      case 'high':
        return `${baseSignature}\n\n⚠️ Réponse requise dans les plus brefs délais`;
      case 'low':
        return `${baseSignature}\n\nMerci de votre patience`;
      default:
        return baseSignature;
    }
  };

  /**
   * Copie l'email généré dans le presse-papiers
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail);
      // Ici on pourrait ajouter une notification de succès
      alert('Email copié dans le presse-papiers !');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      alert('Erreur lors de la copie. Veuillez sélectionner et copier manuellement.');
    }
  };

  // Générer automatiquement l'email quand les données changent
  useEffect(() => {
    if (selectedTemplate && formData.clientName) {
      generateEmail();
    }
  }, [selectedTemplate, formData]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête de l'application */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Assistant pour rédaction de courriels aux clients
          </h1>
          <p className="text-lg text-gray-600">
            Bureau de la traduction - Services publics et Approvisionnement Canada
          </p>
        </div>

        {/* Navigation entre les vues */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setCurrentView('form')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'form'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📝 Rédaction
            </button>
            <button
              onClick={() => setCurrentView('preview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'preview'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              disabled={!generatedEmail}
            >
              👁️ Prévisualisation
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sélecteur de modèles - toujours visible */}
          <div className="lg:col-span-1">
            <TemplateSelector
              templates={emailTemplates}
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
          </div>

          {/* Zone principale - formulaire ou prévisualisation */}
          <div className="lg:col-span-2">
            {currentView === 'form' ? (
              <EmailForm
                formData={formData}
                selectedTemplate={selectedTemplate}
                onFormChange={handleFormChange}
                onGenerate={generateEmail}
              />
            ) : (
              <EmailPreview
                generatedEmail={generatedEmail}
                formData={formData}
                onCopyToClipboard={copyToClipboard}
                onBackToForm={() => setCurrentView('form')}
              />
            )}
          </div>
        </div>

        {/* Pied de page avec informations */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            Cet outil a été développé pour standardiser et améliorer la qualité 
            des communications avec nos clients.
          </p>
          <p className="mt-1">
            Pour toute question ou suggestion d'amélioration, 
            contactez l'équipe de développement.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default EmailAssistant;

