import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      },
      // Proxy everything except known frontend routes and static files
      '^/(?!(dashboard|my-urls|analytics|login|register|home|api|src|@vite|@react-refresh|@id|@fs|node_modules|index\\.html|favicon\\.ico|logo\\.svg|assets|vite\\.svg|$)).*': {
        target: 'http://localhost:8090',
        changeOrigin: true,
      }
    }
  }
})
