import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  darkMode: 'class',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api/auth': {
        target: 'https://silverscisormasterbackend.onrender.com',
        changeOrigin: true
      },
      // '/api/salon': {
      //   target: 'http://localhost:5002',
      //   changeOrigin: true
      // }
    }
  }
})
