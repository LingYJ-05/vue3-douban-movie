<template>
  <div class="loading">
    <div class="welcome">
      <div class="welcome-wrapper">
        <div class="smile">^_^</div>
        <div class="date">{{ date }}</div>
        <div class="test">遇见你，真美好</div>
      </div>
    </div>
    <div class="logo">
      <div class="logo-wrapper">
        <img width="48" height="48" src="./douban-logo.png">
        <div class="logo-desc">
          <span class="title">豆瓣</span>
          <span class="desc">我们的精神角落</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="Loading">
import { ref } from 'vue'


// 添加日期数据
const date = ref(new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }))
</script>

<style scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.welcome {
  text-align: center;
  margin-bottom: 40px;
}

.smile {
  color: #42b983;
  font-size: 60px;
  margin-bottom: 20px;
}

.date {
  font-size: 18px;
  color: #333;
}

.test {
  font-size: 16px;
  color: #666;
  margin-top: 10px;
}

.logo {
  text-align: center;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-wrapper img {
  margin-right: 15px;
}

.logo-desc {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 22px;
  color: #333;
  font-weight: bold;
  margin-bottom: 5px;
}

.desc {
  font-size: 14px;
  color: #666;
}
</style>