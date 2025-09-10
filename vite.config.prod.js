import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Configuration Vite pour la production
export default defineConfig({
  base: '/', // Changé de '/email-assistant/' à '/' pour le déploiement
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild'
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: false,
    allowedHosts: 'all',
  },
  preview: {
    host: '0.0.0.0',
    port: 5175,
    strictPort: false,
  },
})

