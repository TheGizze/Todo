import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // Proxy API calls to backend
    },
  },
})
// This configuration sets up Vite for a React project with a proxy for API calls