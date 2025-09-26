import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8000,
    proxy: {
      '/v2': {
        target: 'https://api.douban.com',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})