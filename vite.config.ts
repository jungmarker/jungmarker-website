import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      // In dev: forward /api/* to the Flask CRM at port 5001
      // In production: point VITE_API_URL env var to your hosted Flask CRM
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
