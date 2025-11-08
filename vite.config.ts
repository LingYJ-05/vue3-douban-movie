import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path' // 

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入 Element Plus 相关函数
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    // 自动导入 Element Plus 组件
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
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
          vue: ['vue', 'vue-router', 'vuex'],
          vendor: ['axios'],
          'movie-components': [
            './src/components/movie-detail/movie-detail.vue',
            './src/components/movie-show/movie-show.vue'
          ]
        }
      }
    }
  },
  // 👇 新增：配置别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), 
    },
  },
})