<!-- 在 App.vue 或 layout 中添加底部导航栏 -->
<template>
  <div class="tab-footer">
    <div class="tab-menu">
      <router-link to="/movie-show" class="tab-item">
        <div class="icon-wrapper">
          <el-icon>
            <Film />
          </el-icon>
        </div>
        <span>热映</span>
      </router-link>
      <router-link to="/rank" class="tab-item">
        <div class="icon-wrapper">
          <el-icon>
            <Histogram />
          </el-icon>
        </div>
        <span>排行榜</span>
      </router-link>
      <router-link to="/user-center" class="tab-item">
        <div class="icon-wrapper">
          <el-icon>
            <User />
          </el-icon>
        </div>
        <span>我的</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { Film, Histogram, User } from '@element-plus/icons-vue'
import { ElIcon } from 'element-plus'
</script>

<style scoped>
.tab-footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  height: 60px;
}

.tab-menu {
  display: flex;
  justify-content: space-around;
  height: 100%;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #666;
  transition: color 0.3s;
}

.tab-item.router-link-active {
  color: #409EFF;
}

.icon-wrapper {
  margin-bottom: 4px;
}

.icon-wrapper :deep(.el-icon) {
  font-size: 20px;
  display: block;
}

.tab-item span {
  font-size: 12px;
  line-height: 1;
}


.tab-item {
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 0 10px;
  width: 33.33%;
  /* 平均分配 */
  color: #666;
  text-decoration: none;
}

.tab-item.router-link-active {
  color: #ff0000;
}

.icon-wrapper {
  margin-bottom: 4px;
  font-size: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tab-item {
    font-size: 10px;
    padding: 0 5px;
  }

  .icon-wrapper {
    font-size: 18px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tab-item {
    font-size: 10px;
    padding: 0 5px;
  }

  .tab-item .el-icon {
    font-size: 18px;
  }
}
</style>