import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'CPA — Estudos ANBIMA',
        short_name: 'CPA',
        description: 'Plataforma de estudos para certificações financeiras brasileiras.',
        theme_color: '#07131f',
        background_color: '#07131f',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,woff2}'] }
    })
  ]
})
