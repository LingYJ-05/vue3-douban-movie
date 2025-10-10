// src/shims-vue.d.ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明 Vuex 模块
declare module 'vuex' {
  const createStore: any
  export { createStore }
  export default any
}

// 声明 SVG 模块
declare module '*.svg' {
  const content: string
  export default content
}