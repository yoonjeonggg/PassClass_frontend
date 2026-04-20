import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8009',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8009',
        changeOrigin: true,
      },
    },
  },
})
