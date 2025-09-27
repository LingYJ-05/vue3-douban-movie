import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import VueLazyload from 'vue3-lazyload'
import { worker } from './mocks/setupWorker.ts'
import store from './components/store/index.js'
// 控制 Mock 是否启用
const isMockEnabled = true

// 根据条件启用 Mock 服务
if (isMockEnabled) {
  worker.start({
    onUnhandledRequest: 'warn', // 改为warn而不是bypass，避免可能的无限循环
  })
}
const app = createApp(App)
app.use(router) // 先使用router插件

// 配置图片懒加载插件
app.use(VueLazyload, {
  loading: '/src/assets/images/star-off.svg', // 使用空星作为占位图
  error: '/src/assets/images/star-off.svg'    // 使用空星作为错误图
})
app.use(store)
app.mount('#app')
