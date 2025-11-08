import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import VueLazyload from 'vue3-lazyload'
import { worker } from './mocks/setupWorker.ts'
import router from './router/index.ts'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //导入 ElementPlus 组件库中的所有图标
// 配置图片懒加载的占位图
import loadingImg from './assets/images/star-off.svg'
import errorImg from './assets/images/star-on.svg'

// 创建Pinia实例
const pinia = createPinia()


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
app.use(pinia)
app.use(ElementPlus)
//注册 ElementPlus 组件库中的所有图标到全局 Vue 应用中
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 配置图片懒加载插件
app.use(VueLazyload, {
  loading: loadingImg,
  error: errorImg
})
// 挂载应用
app.mount('#app')