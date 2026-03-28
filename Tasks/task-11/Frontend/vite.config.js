import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  publicDir: 'public',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      workbox: { skipWaiting: true, clientsClaim: true },
      manifest: {
        name: 'PrimeFlix',
        short_name: 'PrimeFlix',
        description: 'A modern movie and TV show discovery platform.',
        theme_color: '#7c3aed',
        background_color: '#0a0a1a',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          { src: '/favicon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
  server: {
    proxy: { '/api': 'http://localhost:5001' },
  },
  build: { outDir: 'dist', emptyOutDir: true },
});
