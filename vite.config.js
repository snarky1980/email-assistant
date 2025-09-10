import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
// Ce fichier de configuration définit les paramètres pour Vite.
// Pour éviter les conflits de ports lorsque le serveur de développement
// est déjà démarré ailleurs (par ex. port 5173 utilisé par un autre
// projet), nous définissons ici un port alternatif et autorisons Vite
// à basculer automatiquement vers un autre port si nécessaire.
export default defineConfig({
  base: '/email-assistant/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    // Utiliser un port différent pour éviter les conflits locaux.
    port: 5174,
    // En définissant strictPort à false, Vite passera à un port
    // disponible (par exemple 5175) si 5174 est déjà utilisé.
    strictPort: false,
    allowedHosts: ['all', '5174-i368787dyvmhm5wx7wcdx-6ecd0654.manusvm.computer'],
  },
  // Spécifier un port différent pour l'aperçu de production
  preview: {
    port: 5175,
  },
})