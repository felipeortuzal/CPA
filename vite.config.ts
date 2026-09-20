import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg'],
      devOptions: {
        enabled: true,
      },
      manifest: {
        id: '/',
        name: 'CPA — Estudos ANBIMA',
        short_name: 'CPA',
        description: 'Plataforma local e offline de estudos para a nova CPA ANBIMA.',
        theme_color: '#07131f',
        background_color: '#07131f',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'pwa-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'pwa-512x512.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      },
      workbox: {
        cacheId: 'cpa-study-v21',
        globPatterns: ['**/*.{js,css,html,svg,woff2,json}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//]
      }
    })
  ]
})
