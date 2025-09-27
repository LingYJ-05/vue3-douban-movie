<template>
  <div class="tab">
    <router-link to="/movie-show" class="tab-item" tag="div">
      <span class="tab-icon">🎬</span>
      <span class="tab-link">热映</span>
    </router-link>
    <router-link to="/rank" class="tab-item" tag="div">
      <span class="tab-icon">📊</span>
      <span class="tab-link">排行榜</span>
    </router-link>
    <router-link to="/user-center" class="tab-item" tag="div">
      <span class="tab-icon">👤</span>
      <span class="tab-link">我的</span>
    </router-link>
  </div>
</template>

<script setup>

</script>

<style scoped>
.tab {
  position: fixed;
  width: 100%;
  bottom: 0;
  background: #fff;
  display: flex;
  height: 60px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.tab-item {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tab-icon {
  font-size: 20px;
  color: #999;
  transition: all 0.3s;
}

.tab-link {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
  transition: all 0.3s;
}

/* 激活状态样式 */
.router-link-active .tab-icon {
  color: #ff0000;
  transform: scale(1.1);
}

.router-link-active .tab-link {
  color: #ff0000;
}
</style>