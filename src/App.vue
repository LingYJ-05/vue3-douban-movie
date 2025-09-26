<template>
  <div id="app">
    <!-- 加载动画组件 -->
    <Loading v-if="loadingFlag" />
    <!-- 主内容区域 -->
    <div v-else>
      <!-- 使用router-view组件来渲染当前路由对应的页面 -->
      <router-view />
      <!-- 底部导航栏 -->
      <Tab :show="showTab" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import Tab from './components/tab/tab.vue'
import Loading from './base/loading/loading.vue'

const showTab = ref(true)
const loadingFlag = ref(false) // 控制加载动画显示

onMounted(() => {
  // 模拟加载完成，3秒后隐藏loading组件
  setTimeout(() => {
    loadingFlag.value = false
  }, 3000)
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  padding-bottom: 60px;
  /* 为底部导航栏留出空间 */
}

/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  font-size: 14px;
  line-height: 1.5;
}
</style>