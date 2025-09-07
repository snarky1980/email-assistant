/**
 * TemplateSelector - Composant de sélection des modèles d'emails
 * 
 * Ce composant affiche la liste des modèles d'emails disponibles
 * et permet à l'utilisateur de sélectionner celui qui convient
 * le mieux à sa situation.
 * 
 * Props:
 * - templates: Array - Liste des modèles d'emails disponibles
 * - selectedTemplate: Object - Le modèle actuellement sélectionné
 * - onTemplateSelect: Function - Callback pour la sélection d'un modèle
 * 
 * @author Bureau de la traduction
 */

import React, { useState } from 'react';

const TemplateSelector = ({ templates, selectedTemplate, onTemplateSelect }) => {
  // État pour le filtre de recherche
  const [searchFilter, setSearchFilter] = useState('');
  
  // État pour le filtre par catégorie
  const [categoryFilter, setCategoryFilter] = useState('all');

  /**
   * Filtre les modèles selon les critères de recherche et de catégorie
   * @returns {Array} Liste des modèles filtrés
   */
  const getFilteredTemplates = () => {
    if (!templates) return [];
    
    return templates.filter(template => {
      // Filtre par recherche textuelle
      const matchesSearch = searchFilter === '' || 
        template.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        template.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (template.tags && template.tags.some(tag => 
          tag.toLowerCase().includes(searchFilter.toLowerCase())
        ));
      
      // Filtre par catégorie
      const matchesCategory = categoryFilter === 'all' || 
        template.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  };

  /**
   * Obtient toutes les catégories disponibles
   * @returns {Array} Liste des catégories uniques
   */
  const getAvailableCategories = () => {
    if (!templates) return [];
    
    const categories = templates.map(template => template.category);
    return [...new Set(categories)].sort();
  };

  /**
   * Obtient l'icône appropriée pour une catégorie
   * @param {string} category - La catégorie
   * @returns {string} L'emoji correspondant
   */
  const getCategoryIcon = (category) => {
    const icons = {
      'information': '📋',
      'demande': '❓',
      'confirmation': '✅',
      'suivi': '📞',
      'probleme': '⚠️',
      'remerciement': '🙏',
      'urgence': '🚨',
      'standard': '📧'
    };
    return icons[category] || '📄';
  };

  /**
   * Obtient la couleur de l'indicateur de priorité
   * @param {string} priority - Le niveau de priorité
   * @returns {string} Les classes CSS pour la couleur
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTemplates = getFilteredTemplates();
  const availableCategories = getAvailableCategories();

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* En-tête */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          📚 Modèles d'emails
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Sélectionnez un modèle adapté à votre situation
        </p>
      </div>

      {/* Filtres */}
      <div className="p-4 space-y-3 border-b border-gray-200 bg-gray-50">
        {/* Recherche */}
        <div>
          <label htmlFor="search" className="block text-xs font-medium text-gray-700 mb-1">
            Rechercher
          </label>
          <input
            type="text"
            id="search"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Nom, description, mots-clés..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filtre par catégorie */}
        <div>
          <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            id="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toutes les catégories</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>
                {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste des modèles */}
      <div className="max-h-96 overflow-y-auto">
        {filteredTemplates.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-gray-600">
              Aucun modèle trouvé pour ces critères
            </p>
            <button
              onClick={() => {
                setSearchFilter('');
                setCategoryFilter('all');
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTemplates.map((template, index) => (
              <div
                key={template.id || index}
                onClick={() => onTemplateSelect(template)}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedTemplate?.id === template.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                }`}
              >
                {/* En-tête du modèle */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getCategoryIcon(template.category)}
                    </span>
                    <h3 className="font-medium text-gray-900 text-sm">
                      {template.name}
                    </h3>
                  </div>
                  
                  {/* Indicateur de priorité */}
                  {template.priority && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(template.priority)}`}>
                      {template.priority === 'high' ? 'Urgent' : 
                       template.priority === 'medium' ? 'Normal' : 'Standard'}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {template.description}
                </p>

                {/* Tags */}
                {template.tags && template.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{template.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Métadonnées */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Catégorie: {template.category}
                  </span>
                  {template.estimatedTime && (
                    <span>
                      ⏱️ {template.estimatedTime} min
                    </span>
                  )}
                </div>

                {/* Indicateur de sélection */}
                {selectedTemplate?.id === template.id && (
                  <div className="mt-2 flex items-center text-blue-600 text-sm">
                    <span className="mr-1">✓</span>
                    Modèle sélectionné
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pied de page avec statistiques */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            {filteredTemplates.length} modèle{filteredTemplates.length !== 1 ? 's' : ''} 
            {searchFilter || categoryFilter !== 'all' ? ' trouvé' + (filteredTemplates.length !== 1 ? 's' : '') : ' disponible' + (filteredTemplates.length !== 1 ? 's' : '')}
          </span>
          {selectedTemplate && (
            <span className="text-blue-600 font-medium">
              {selectedTemplate.name}
            </span>
          )}
        </div>
      </div>

      {/* Aide contextuelle */}
      {!selectedTemplate && (
        <div className="p-4 bg-blue-50 border-t border-blue-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-400 text-lg">💡</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Comment choisir un modèle ?
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Identifiez le type de communication (information, demande, etc.)</li>
                  <li>Considérez le niveau d'urgence de votre message</li>
                  <li>Utilisez les filtres pour trouver rapidement le bon modèle</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;

