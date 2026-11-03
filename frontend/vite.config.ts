import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The owner's iPhone runs iOS 16; Vite 8 defaults to Safari/iOS 16.4+.
  build: {
    target: ['chrome111', 'edge111', 'firefox114', 'safari16', 'ios16'],
    cssTarget: ['chrome111', 'edge111', 'firefox114', 'safari16', 'ios16'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
