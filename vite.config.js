import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
// https://vitejs.dev/config/
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
                rewrite: function (path) { return path; }
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
});
