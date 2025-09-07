#!/usr/bin/env python3
"""
Script pour analyser et déminifier le code JavaScript de l'assistant email
"""

import re
import json

def analyze_minified_js(file_path):
    """Analyser le fichier JavaScript minifié pour comprendre sa structure"""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("=== ANALYSE DU FICHIER JAVASCRIPT MINIFIÉ ===")
    print(f"Taille du fichier: {len(content)} caractères")
    print(f"Nombre de lignes: {content.count(chr(10)) + 1}")
    
    # Rechercher les patterns React
    react_patterns = {
        'jsx': r'jsx\s*[:=]',
        'useState': r'useState',
        'useEffect': r'useEffect',
        'createElement': r'createElement',
        'Fragment': r'Fragment',
        'Component': r'Component'
    }
    
    print("\n=== PATTERNS REACT DÉTECTÉS ===")
    for pattern_name, pattern in react_patterns.items():
        matches = re.findall(pattern, content, re.IGNORECASE)
        if matches:
            print(f"{pattern_name}: {len(matches)} occurrences")
    
    # Rechercher des strings qui pourraient être des textes de l'interface
    strings = re.findall(r'"([^"]{10,})"', content)
    strings.extend(re.findall(r"'([^']{10,})'", content))
    
    print("\n=== CHAÎNES DE CARACTÈRES LONGUES (possibles textes UI) ===")
    for i, string in enumerate(strings[:20]):  # Limiter à 20 pour éviter trop de sortie
        if len(string) > 15:
            print(f"{i+1}: {string[:100]}...")
    
    # Rechercher des noms de fonctions possibles
    functions = re.findall(r'function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)', content)
    print(f"\n=== FONCTIONS DÉTECTÉES ===")
    print(f"Nombre de fonctions: {len(functions)}")
    if functions:
        print("Premières fonctions:", functions[:10])
    
    return content

def create_readable_structure():
    """Créer une structure de fichiers lisibles pour l'application"""
    
    print("\n=== CRÉATION DE LA STRUCTURE LISIBLE ===")
    
    # Structure de base d'une application React
    structure = {
        'src/': {
            'components/': {
                'EmailAssistant.jsx': 'Composant principal de l\'assistant email',
                'EmailForm.jsx': 'Formulaire de saisie email',
                'EmailPreview.jsx': 'Prévisualisation de l\'email',
                'TemplateSelector.jsx': 'Sélecteur de modèles'
            },
            'styles/': {
                'main.css': 'Styles principaux',
                'components.css': 'Styles des composants'
            },
            'utils/': {
                'emailTemplates.js': 'Modèles d\'emails',
                'helpers.js': 'Fonctions utilitaires'
            },
            'App.jsx': 'Composant racine de l\'application',
            'main.jsx': 'Point d\'entrée de l\'application'
        },
        'public/': {
            'index.html': 'Fichier HTML principal'
        }
    }
    
    return structure

if __name__ == "__main__":
    # Analyser le fichier JavaScript minifié
    js_content = analyze_minified_js('/home/ubuntu/email-assistant/assets/index-_jp-VJOY.js')
    
    # Créer la structure recommandée
    structure = create_readable_structure()
    
    print("\n=== STRUCTURE RECOMMANDÉE ===")
    def print_structure(struct, indent=0):
        for key, value in struct.items():
            print("  " * indent + key)
            if isinstance(value, dict):
                print_structure(value, indent + 1)
            else:
                print("  " * (indent + 1) + f"# {value}")
    
    print_structure(structure)

