import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build' // ✅ Esta línea cambia la salida de Vite a /build
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://hr-beneficios-api-hxeshwbedrbndmc5.centralus-01.azurewebsites.net',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
