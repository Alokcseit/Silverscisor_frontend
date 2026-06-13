import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './store'

const queryClient = new QueryClient()

// Register Firebase messaging service worker
if ('serviceWorker' in navigator && import.meta.env.VITE_FIREBASE_API_KEY) {
  const swUrl = `/firebase-messaging-sw.js?apiKey=${encodeURIComponent(import.meta.env.VITE_FIREBASE_API_KEY)}&authDomain=${encodeURIComponent(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '')}&projectId=${encodeURIComponent(import.meta.env.VITE_FIREBASE_PROJECT_ID || '')}&storageBucket=${encodeURIComponent(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '')}&messagingSenderId=${encodeURIComponent(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '')}&appId=${encodeURIComponent(import.meta.env.VITE_FIREBASE_APP_ID || '')}`
  navigator.serviceWorker.register(swUrl).catch((err) => {
    console.warn('Firebase SW registration failed:', err.message)
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
