import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/vue3-douban-movie/',
  server: {
    port: 8000,
    proxy: {
      '/v2': {
        target: 'https://api.douban.com',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // 将Vue相关库打包到一个chunk
          vue: ['vue', 'vue-router', 'vuex'],
          // 将其他第三方库打包到一个chunk
          vendor: ['axios'],
          // 可以根据组件大小和使用频率进一步分割
          'movie-components': [
            './src/components/movie-detail/movie-detail.vue',
            './src/components/movie-show/movie-show.vue'
          ]
        }
      }
    }
  }
})