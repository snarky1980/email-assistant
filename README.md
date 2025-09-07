# Assistant pour Rédaction de Courriels aux Clients

Une application web moderne pour aider à la rédaction de courriels professionnels destinés aux clients du Bureau de la traduction.

## 🎯 Fonctionnalités

- **30+ modèles d'email bilingues** (français/anglais)
- **Interface intuitive** avec recherche et filtres
- **Variables personnalisables** avec descriptions claires
- **Édition en temps réel** avec aperçu instantané
- **Copie vers presse-papiers** en un clic
- **Interface responsive** pour tous les appareils

## 🚀 Utilisation

1. **Sélectionnez** un modèle dans la liste de gauche
2. **Ajustez** les variables selon vos besoins
3. **Éditez** directement le contenu final
4. **Copiez** l'email vers votre client de messagerie

## 🛠️ Technologies

- **React** - Interface utilisateur
- **Vite** - Build tool moderne
- **Tailwind CSS** - Styles utilitaires
- **Lucide React** - Icônes modernes

## 📦 Installation Locale

```bash
# Cloner le repository
git clone https://github.com/VOTRE-USERNAME/email-assistant.git
cd email-assistant

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Construire pour production
npm run build
```

## 🔧 Modification des Modèles

Les modèles d'email se trouvent dans `src/assets/complete_email_templates.json`.

### Ajouter un nouveau modèle :

```json
{
  "id": "mon_nouveau_modele",
  "category": "Ma Catégorie",
  "title": {
    "fr": "Titre en français",
    "en": "Title in English"
  },
  "description": {
    "fr": "Description en français",
    "en": "Description in English"
  },
  "subject": {
    "fr": "Objet: <<Variable>>",
    "en": "Subject: <<Variable>>"
  },
  "body": {
    "fr": "Corps du message en français...",
    "en": "Message body in English..."
  },
  "variables": ["Variable"]
}
```

## 🌐 Déploiement

Ce projet est configuré pour un déploiement automatique sur GitHub Pages via GitHub Actions.

Chaque push sur la branche `main` déclenche automatiquement :
1. Installation des dépendances
2. Build de production
3. Déploiement sur GitHub Pages

## 📝 Licence

Ce projet est destiné à un usage interne du Bureau de la traduction.

## 🤝 Contribution

Pour ajouter des modèles ou améliorer l'interface :
1. Forkez le repository
2. Créez une branche pour vos modifications
3. Testez vos changements localement
4. Soumettez une Pull Request

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.

---

**Bureau de la traduction** - Assistant pour rédaction de courriels aux clients

