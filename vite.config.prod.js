import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  base: "/email-assistant/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-v3-[hash].js`,
        chunkFileNames: `assets/[name]-v3-[hash].js`,
        assetFileNames: `assets/[name]-v3-[hash].[ext]`
      }
    }
  }
})
