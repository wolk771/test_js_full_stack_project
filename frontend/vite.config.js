import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../public', // Schreibt das Ergebnis direkt ins Backend-Public
    emptyOutDir: true    // Löscht alten Müll vorher
  },
  server: { proxy: { '/api': 'http://localhost:3000' } }
})
