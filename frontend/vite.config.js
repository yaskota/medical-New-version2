import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Proxy API requests to the Node.js server
      '/api/auth': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/doctors': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/hospitals': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/departments': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/medical-files': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/patient-records': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/appointments': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/schedules': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/reviews': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/admin': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
