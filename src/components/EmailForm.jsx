/**
 * EmailForm - Composant de formulaire pour la saisie des données d'email
 * 
 * Ce composant gère la saisie des informations nécessaires pour personnaliser
 * les modèles d'emails. Il inclut la validation des données et la gestion
 * des différents types de champs.
 * 
 * Props:
 * - formData: Object - Les données actuelles du formulaire
 * - selectedTemplate: Object - Le modèle d'email sélectionné
 * - onFormChange: Function - Callback pour les changements de données
 * - onGenerate: Function - Callback pour générer l'email
 * 
 * @author Bureau de la traduction
 */

import React, { useState } from 'react';

const EmailForm = ({ formData, selectedTemplate, onFormChange, onGenerate }) => {
  // État local pour la validation des champs
  const [fieldErrors, setFieldErrors] = useState({});
  
  // État pour indiquer si le formulaire a été soumis
  const [isSubmitted, setIsSubmitted] = useState(false);

  /**
   * Valide un champ spécifique
   * @param {string} fieldName - Le nom du champ à valider
   * @param {string} value - La valeur du champ
   * @returns {string|null} Message d'erreur ou null si valide
   */
  const validateField = (fieldName, value) => {
    switch (fieldName) {
      case 'clientName':
        if (!value.trim()) {
          return 'Le nom du client est requis';
        }
        if (value.trim().length < 2) {
          return 'Le nom du client doit contenir au moins 2 caractères';
        }
        return null;
        
      case 'subject':
        if (!value.trim()) {
          return 'Le sujet est requis';
        }
        if (value.length > 100) {
          return 'Le sujet ne doit pas dépasser 100 caractères';
        }
        return null;
        
      case 'customMessage':
        if (value.length > 500) {
          return 'Le message personnalisé ne doit pas dépasser 500 caractères';
        }
        return null;
        
      default:
        return null;
    }
  };

  /**
   * Gestionnaire pour les changements de champs
   * @param {Event} event - L'événement de changement
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    // Mettre à jour les données du formulaire
    const newData = { [name]: value };
    onFormChange(newData);
    
    // Valider le champ modifié
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  /**
   * Valide l'ensemble du formulaire
   * @returns {boolean} True si le formulaire est valide
   */
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Valider tous les champs requis
    const requiredFields = ['clientName', 'subject'];
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field] || '');
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });
    
    // Valider les champs optionnels
    const optionalFields = ['customMessage'];
    optionalFields.forEach(field => {
      const error = validateField(field, formData[field] || '');
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });
    
    setFieldErrors(errors);
    return isValid;
  };

  /**
   * Gestionnaire pour la soumission du formulaire
   * @param {Event} event - L'événement de soumission
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    
    if (validateForm()) {
      onGenerate();
    }
  };

  /**
   * Réinitialise le formulaire
   */
  const handleReset = () => {
    onFormChange({
      clientName: '',
      subject: selectedTemplate?.defaultSubject || '',
      customMessage: '',
      urgency: 'normal',
      language: 'fr'
    });
    setFieldErrors({});
    setIsSubmitted(false);
  };

  // Si aucun modèle n'est sélectionné, afficher un message
  if (!selectedTemplate) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sélectionnez un modèle d'email
          </h3>
          <p className="text-gray-600">
            Choisissez un modèle dans la liste de gauche pour commencer 
            à rédiger votre email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* En-tête du formulaire */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          📝 Personnalisation de l'email
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Modèle sélectionné: <span className="font-medium">{selectedTemplate.name}</span>
        </p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Nom du client */}
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
            Nom du client <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName || ''}
            onChange={handleInputChange}
            placeholder="Ex: Madame Dupont, Monsieur Martin..."
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              fieldErrors.clientName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {fieldErrors.clientName && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.clientName}</p>
          )}
        </div>

        {/* Sujet de l'email */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Sujet de l'email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject || ''}
            onChange={handleInputChange}
            placeholder="Sujet de votre email..."
            maxLength={100}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              fieldErrors.subject ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between mt-1">
            {fieldErrors.subject ? (
              <p className="text-sm text-red-600">{fieldErrors.subject}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Sujet clair et professionnel
              </p>
            )}
            <p className="text-sm text-gray-400">
              {(formData.subject || '').length}/100
            </p>
          </div>
        </div>

        {/* Message personnalisé */}
        <div>
          <label htmlFor="customMessage" className="block text-sm font-medium text-gray-700 mb-2">
            Message personnalisé (optionnel)
          </label>
          <textarea
            id="customMessage"
            name="customMessage"
            value={formData.customMessage || ''}
            onChange={handleInputChange}
            placeholder="Ajoutez des informations spécifiques à ce client ou cette situation..."
            rows={4}
            maxLength={500}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
              fieldErrors.customMessage ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between mt-1">
            {fieldErrors.customMessage ? (
              <p className="text-sm text-red-600">{fieldErrors.customMessage}</p>
            ) : (
              <p className="text-sm text-gray-500">
                Ce message sera inséré dans le modèle
              </p>
            )}
            <p className="text-sm text-gray-400">
              {(formData.customMessage || '').length}/500
            </p>
          </div>
        </div>

        {/* Niveau d'urgence */}
        <div>
          <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 mb-2">
            Niveau d'urgence
          </label>
          <select
            id="urgency"
            name="urgency"
            value={formData.urgency || 'normal'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">🟢 Faible - Réponse non urgente</option>
            <option value="normal">🟡 Normal - Réponse dans les délais habituels</option>
            <option value="high">🔴 Élevé - Réponse requise rapidement</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            Ceci affectera la signature et le ton de l'email
          </p>
        </div>

        {/* Langue */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            Langue de l'email
          </label>
          <select
            id="language"
            name="language"
            value={formData.language || 'fr'}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            🔄 Réinitialiser
          </button>
          
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!formData.clientName || !formData.subject}
          >
            ✨ Générer l'email
          </button>
        </div>

        {/* Message d'aide */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-400 text-xl">💡</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Conseils pour un email efficace
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Utilisez un nom de client complet et respectueux</li>
                  <li>Rédigez un sujet clair et informatif</li>
                  <li>Personnalisez le message selon le contexte</li>
                  <li>Choisissez le niveau d'urgence approprié</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EmailForm;

