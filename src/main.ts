import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import VueLazyload from 'vue3-lazyload'
import { worker } from './mocks/setupWorker.ts'
import store from './components/store/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置图片懒加载的占位图
import loadingImg from './assets/images/star-off.svg'
import errorImg from './assets/images/star-on.svg'

// 控制 Mock 是否启用
const isMockEnabled = true // 启用 Mock 服务

// 根据条件启用 Mock 服务
if (isMockEnabled) {
  worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/vue3-douban-movie/mockServiceWorker.js'
    }
  })
}

// 创建应用实例
const app = createApp(App)
app.use(router)
app.use(ElementPlus)

// 配置图片懒加载插件
app.use(VueLazyload, {
  loading: loadingImg,
  error: errorImg
})

app.use(store)

// 注册 Scroll 组件
import Scroll from './base/scroll/scroll.vue'
app.component('Scroll', Scroll)

// 挂载应用
app.mount('#app')