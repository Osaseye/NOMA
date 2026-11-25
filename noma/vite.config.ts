import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'pwa-192x192.png',
        'pwa-512x512.png',
        'pwa-maskable-512x512.png',
        'icon.png',
      ],
      manifest: {
        name: 'NOMA | Online Shopping Marketplace',
        short_name: 'NOMA',
        description:
          'Shop Electronics, Kitchen Appliances, Solar Power, Smartphones & Home Essentials at NOMA.',
        theme_color: '#0B1220',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
      },
    }),
  ],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'firebase',
              test: /node_modules[\\/](firebase|@firebase)[\\/]/,
              priority: 30,
            },
            {
              name: 'recharts',
              test: /node_modules[\\/](recharts|d3-|victory-vendor)[\\/]/,
              priority: 25,
            },
            {
              name: 'motion',
              test: /node_modules[\\/](motion|framer-motion)[\\/]/,
              priority: 20,
            },
            {
              name: 'icons',
              test: /node_modules[\\/]@phosphor-icons[\\/]/,
              priority: 15,
            },
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'zustand'],
    exclude: ['@imgly/background-removal', 'onnxruntime-web'],
  },
})
