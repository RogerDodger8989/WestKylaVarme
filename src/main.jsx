import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// Registrera service worker (vite-plugin-pwa)
if ('serviceWorker' in navigator) {
  // VitePWA injicerar rätt filnamn vid build
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // tyst fail i dev om sw inte finns ännu
    })
  })
}

createRoot(document.getElementById('root')).render(<App />)
