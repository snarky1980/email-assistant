import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  base: "/email-assistant/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
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
