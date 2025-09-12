# 📧 Assistant Email - Bureau de la traduction

Application web moderne pour la rédaction d'emails aux clients du Bureau de la traduction du gouvernement canadien.

## 🎯 Fonctionnalités principales

### ✅ Gestion des modèles
- **22 modèles d'emails** pré-configurés et chargés automatiquement
- **Recherche intelligente** par titre, description ou catégorie
- **Filtrage par catégorie** (Devis, Gestion de projets, Problèmes techniques, etc.)
- **Interface bilingue** FR/EN avec traductions complètes

### ✅ Variables intelligentes
- **Types de variables spécialisés** : email, téléphone, date, heure, nombre, texte
- **Couleurs distinctes par type** :
  - 📧 **Bleu** pour emails
  - 📞 **Vert** pour téléphones  
  - 📅 **Violet** pour dates
  - 🕐 **Orange** pour heures
  - 🔢 **Ambre** pour nombres
  - 📝 **Gris** pour texte
- **Sélecteurs spécialisés** : date picker, time picker avec icônes
- **Validation en temps réel** avec indicateurs Valide/Non-valide

### ✅ Édition avancée
- **Zones d'édition uniquement** (pas de fenêtres d'aperçu)
- **Remplacement automatique** des variables dans le texte
- **Interface responsive** adaptée desktop et mobile

### ✅ Fonctions de copie
- **4 boutons de copie** distincts :
  - 📧 **Copier l'objet** (bleu)
  - 📝 **Copier le corps** (vert)
  - 🚀 **Copier tout** (gradient principal)
  - 🔗 **Copier le lien profond** (violet, séparé à gauche)
- **Liens profonds** pour partager des templates spécifiques
- **Feedback visuel** avec animations de confirmation

## 🛠️ Technologies utilisées

- **React 18** avec hooks modernes
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes
- **Shadcn/ui** pour les composants UI

## 📁 Structure du projet

```
email-assistant/
├── src/
│   ├── components/
│   │   ├── ui/                    # Composants UI réutilisables
│   │   └── HighlightedTextarea.jsx # Composant de surlignage (non utilisé)
│   ├── utils/
│   │   └── storage.js             # Utilitaires de stockage local
│   ├── App.jsx                    # Composant principal
│   ├── App.css                    # Styles personnalisés
│   └── main.jsx                   # Point d'entrée
├── public/
│   └── complete_email_templates.json # Base de données des modèles
├── vite.config.js                 # Configuration production
├── vite.config.dev.js             # Configuration développement
└── package.json                   # Dépendances et scripts
```

## 🚀 Installation et développement

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
git clone https://github.com/snarky1980/email-assistant.git
cd email-assistant
npm install
```

### Développement
```bash
# Serveur de développement
npm run dev

# Build de production
npm run build

# Aperçu de production
npm run preview
```

### Configuration des ports
- **Développement** : Port 5174 (ou suivant disponible)
- **Aperçu** : Port 5175

## 📝 Utilisation

1. **Sélectionner un modèle** dans le panneau de gauche
2. **Remplir les variables** avec les valeurs appropriées
3. **Éditer le contenu** dans les zones Objet et Corps
4. **Copier** le contenu souhaité avec les boutons dédiés

### Liens profonds
Partagez des templates spécifiques avec des URLs comme :
```
https://votre-site.com/?id=template-id&lang=fr
```

## 🎨 Personnalisation

### Couleurs des variables
Les couleurs sont définies dans `App.jsx` dans la fonction `getVariableColor()` :

```javascript
const colors = {
  email: 'border-blue-300 focus:border-blue-500 bg-blue-50',
  phone: 'border-green-300 focus:border-green-500 bg-green-50',
  date: 'border-purple-300 focus:border-purple-500 bg-purple-50',
  // ...
}
```

### Ajout de nouveaux types de variables
1. Ajouter le type dans `complete_email_templates.json`
2. Définir la couleur dans `getVariableColor()`
3. Ajouter la logique de validation dans `validateVariable()`
4. Créer l'input spécialisé dans `getVariableInput()`

## 📊 Base de données des modèles

Le fichier `public/complete_email_templates.json` contient :
- **templates** : Liste des modèles avec titre, description, catégorie
- **variables** : Définitions des variables avec types et exemples
- **Traductions** : Contenu en français et anglais

## 🔧 Améliorations techniques récentes

### ✅ Corrections apportées
- **Problèmes de police** : Suppression des drop-shadow illisibles
- **Surlignage des variables** : Implémentation dans les zones d'édition
- **Configuration Vite** : Optimisation pour le déploiement
- **Code organisation** : Documentation et structure claire

### 🎯 Fonctionnalités à venir
- Surlignage visuel des variables dans les zones d'édition
- Intégration d'un bot IA pour l'assistance à la rédaction
- Identité visuelle du Bureau de la traduction
- Sauvegarde automatique des brouillons

## 📄 Licence

Ce projet est développé pour le Bureau de la traduction du gouvernement canadien.

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créer une branche feature
3. Commiter les changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

---

**Développé avec ❤️ pour le Bureau de la traduction**

