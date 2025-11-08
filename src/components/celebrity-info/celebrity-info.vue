<template>
  <transition name="slide">
    <div class="info-wrapper" v-show="showFlag">
      <!-- 固定标题栏 -->
      <div class="fixed-title">
        <span class="back" @click="close">
          <i class="icon-close"></i>
        </span>
        <span class="type">
          影人简介
        </span>
      </div>

      <!-- 滚动内容 -->
      <scroll class="celebrity-info" ref="scrollRef">
        <div class="scroll-wrapper">
          <!-- 影人姓名 -->
          <h1 class="name">{{ infoLists.name }}</h1>
          <h2 class="name-en">{{ infoLists.name_en }}</h2>

          <!-- 详细信息列表 -->
          <div class="info-lists">
            <div class="gender">
              <span class="item">性别:</span>
              <span>{{ infoLists.gender || '暂无信息' }}</span>
            </div>
            <div class="constellation">
              <span class="item">星座:</span>
              <span>{{ infoLists.constellation || '暂无信息' }}</span>
            </div>
            <div class="birthday">
              <span class="item">出生日期:</span>
              <span>{{ infoLists.birthday || '暂无信息' }}</span>
            </div>
            <div class="born-place">
              <span class="item">出生地:</span>
              <span>{{ infoLists.born_place || '暂无信息' }}</span>
            </div>
            <div class="more-name">
              <span class="item">更多中文名:</span>
              <span class="more">{{ getNames(infoLists.aka) }}</span>
            </div>
          </div>

          <!-- 个人简介 -->
          <p class="summary">{{ infoLists.summary }}</p>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script setup>
// 1. 导入需要的模块
import { ref, nextTick } from 'vue';
import Scroll from 'base/scroll/scroll';

// 2. 定义props
const props = defineProps({
  infoLists: {
    type: Object,
    default: () => ({})
  }
});

// 3. 创建响应式数据
const showFlag = ref(false);

// 4. 创建引用
const scrollRef = ref(null);

// 5. 方法定义

// 关闭弹窗
const close = () => {
  showFlag.value = false;
};

// 显示弹窗
const show = async () => {
  showFlag.value = true;
  await nextTick(); // 等待DOM更新
  if (scrollRef.value && scrollRef.value.refresh) {
    scrollRef.value.refresh();
  }
};

// 获取更多中文名
const getNames = (lists) => {
  if (!lists || lists.length === 0 || lists[0] === '') {
    return '暂无信息';
  }
  return lists.join('/');
};

// 6. 暴露给父组件的方法
// 在Vue3中，需要使用defineExpose来暴露方法给父组件
defineExpose({
  show,
  close
});
</script>

<style scoped>
/* 自定义对话框样式 */
:deep(.el-dialog) {
  padding: 0;
  border-radius: 0;
  background-color: #f5f5f5;
}

:deep(.el-dialog__header) {
  padding: 0;
  border-bottom: none;
}

:deep(.el-dialog__body) {
  padding: 0;
  overflow: hidden;
  height: calc(100vh - 50px);
}

/* 自定义标题栏 */
.custom-header {
  display: flex;
  align-items: center;
  height: 50px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 20px;
}

.close-btn {
  margin-right: 20px;
  color: #606266;
}

.title-text {
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

/* 滚动区域 */
.celebrity-info {
  height: 100%;
}

.scroll-wrapper {
  padding: 20px;
}

/* 姓名卡片 */
.name-card {
  text-align: center;
  padding: 30px 20px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #f6f6f6, #fff);
}

.name-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.name {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 10px 0;
}

.name-en {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 信息卡片 */
.info-card {
  margin-bottom: 20px;
}

:deep(.el-descriptions) {
  font-size: 14px;
}

:deep(.el-descriptions__label) {
  font-weight: 500;
  color: #606266;
  width: 100px;
}

:deep(.el-descriptions__content) {
  color: #303133;
}

/* 简介卡片 */
.summary-card {
  margin-bottom: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.summary {
  line-height: 1.8;
  color: #606266;
  text-indent: 2em;
  margin: 10px 0 0 0;
  word-wrap: break-word;
}

/* 适配移动设备 */
@media (max-width: 768px) {
  .scroll-wrapper {
    padding: 10px;
  }
  
  .name {
    font-size: 20px;
  }
  
  :deep(.el-descriptions__label) {
    width: 80px;
    font-size: 13px;
  }
  
  :deep(.el-descriptions__content) {
    font-size: 13px;
  }
}
</style>