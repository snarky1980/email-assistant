/**
 * EmailPreview - Composant de prévisualisation de l'email généré
 * 
 * Ce composant affiche l'email final généré avec une mise en forme
 * professionnelle et des options pour copier ou modifier le contenu.
 * 
 * Props:
 * - generatedEmail: string - Le contenu de l'email généré
 * - formData: Object - Les données du formulaire utilisées
 * - onCopyToClipboard: Function - Callback pour copier l'email
 * - onBackToForm: Function - Callback pour retourner au formulaire
 * 
 * @author Bureau de la traduction
 */

import React, { useState } from 'react';

const EmailPreview = ({ generatedEmail, formData, onCopyToClipboard, onBackToForm }) => {
  // État pour indiquer si l'email a été copié
  const [isCopied, setIsCopied] = useState(false);
  
  // État pour l'édition en ligne
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(generatedEmail);

  /**
   * Gestionnaire pour la copie dans le presse-papiers
   */
  const handleCopy = async () => {
    try {
      await onCopyToClipboard();
      setIsCopied(true);
      // Réinitialiser l'état après 3 secondes
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  /**
   * Gestionnaire pour l'édition du contenu
   */
  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(generatedEmail);
  };

  /**
   * Sauvegarde les modifications
   */
  const handleSaveEdit = () => {
    setIsEditing(false);
    // Ici on pourrait mettre à jour l'email généré si nécessaire
  };

  /**
   * Annule l'édition
   */
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(generatedEmail);
  };

  /**
   * Formate le contenu de l'email pour l'affichage
   * @param {string} content - Le contenu brut de l'email
   * @returns {JSX.Element} Le contenu formaté
   */
  const formatEmailContent = (content) => {
    if (!content) return null;
    
    return content.split('\n').map((line, index) => {
      // Ligne vide
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Ligne de signature (commence par "Cordialement" ou contient "Bureau de la traduction")
      if (line.includes('Cordialement') || line.includes('Bureau de la traduction')) {
        return (
          <p key={index} className="text-gray-700 font-medium">
            {line}
          </p>
        );
      }
      
      // Ligne d'alerte (contient des emojis d'alerte)
      if (line.includes('⚠️') || line.includes('🔴')) {
        return (
          <p key={index} className="text-red-600 font-semibold bg-red-50 px-2 py-1 rounded">
            {line}
          </p>
        );
      }
      
      // Ligne normale
      return (
        <p key={index} className="text-gray-800 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  /**
   * Génère les métadonnées de l'email pour l'affichage
   */
  const getEmailMetadata = () => {
    const wordCount = generatedEmail.split(/\s+/).length;
    const charCount = generatedEmail.length;
    const estimatedReadTime = Math.ceil(wordCount / 200); // 200 mots par minute
    
    return {
      wordCount,
      charCount,
      estimatedReadTime,
      language: formData.language === 'fr' ? 'Français' : 'English',
      urgency: {
        low: 'Faible',
        normal: 'Normal',
        high: 'Élevé'
      }[formData.urgency] || 'Normal'
    };
  };

  const metadata = getEmailMetadata();

  if (!generatedEmail) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📧</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun email généré
          </h3>
          <p className="text-gray-600 mb-4">
            Remplissez le formulaire et cliquez sur "Générer l'email" 
            pour voir la prévisualisation.
          </p>
          <button
            onClick={onBackToForm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            ← Retour au formulaire
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* En-tête de la prévisualisation */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              👁️ Prévisualisation de l'email
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Vérifiez le contenu avant de l'utiliser
            </p>
          </div>
          <button
            onClick={onBackToForm}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            ← Modifier
          </button>
        </div>
      </div>

      {/* Métadonnées de l'email */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Mots:</span>
            <span className="ml-1 font-medium">{metadata.wordCount}</span>
          </div>
          <div>
            <span className="text-gray-500">Caractères:</span>
            <span className="ml-1 font-medium">{metadata.charCount}</span>
          </div>
          <div>
            <span className="text-gray-500">Lecture:</span>
            <span className="ml-1 font-medium">{metadata.estimatedReadTime} min</span>
          </div>
          <div>
            <span className="text-gray-500">Urgence:</span>
            <span className="ml-1 font-medium">{metadata.urgency}</span>
          </div>
        </div>
      </div>

      {/* Simulation de l'interface email */}
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* En-tête de l'email simulé */}
          <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="text-gray-600 w-16">De:</span>
                <span className="text-gray-900">Bureau de la traduction &lt;traduction@canada.ca&gt;</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-16">À:</span>
                <span className="text-gray-900">{formData.clientName || '[Nom du client]'}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-16">Sujet:</span>
                <span className="text-gray-900 font-medium">{formData.subject || '[Sujet]'}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-16">Date:</span>
                <span className="text-gray-900">{new Date().toLocaleDateString('fr-CA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
          </div>

          {/* Contenu de l'email */}
          <div className="p-6 bg-white">
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Contenu de l'email..."
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 font-serif text-base leading-relaxed">
                {formatEmailContent(generatedEmail)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              disabled={isEditing}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              ✏️ Modifier
            </button>
            
            <button
              onClick={handleCopy}
              className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                isCopied
                  ? 'text-green-700 bg-green-100 border border-green-300'
                  : 'text-white bg-blue-600 border border-transparent hover:bg-blue-700 focus:ring-blue-500'
              }`}
            >
              {isCopied ? '✅ Copié!' : '📋 Copier l\'email'}
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Prêt à être utilisé dans votre client email
          </div>
        </div>
      </div>

      {/* Conseils d'utilisation */}
      <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-400 text-xl">💡</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Conseils avant l'envoi
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Relisez attentivement le contenu pour détecter toute erreur</li>
                <li>Vérifiez que les informations du client sont correctes</li>
                <li>Assurez-vous que le niveau d'urgence correspond à la situation</li>
                <li>Ajoutez des pièces jointes si nécessaire avant l'envoi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;

