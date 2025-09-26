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
.info-wrapper {
  position: fixed;
  top: 0;
  width: 100%;
  bottom: 0;
  z-index: 500;
  background-color: #f5f5f5;
  transition: all 0.3s;
}

.info-wrapper {
  transform: translate3d(0, 0, 0);
}

.info-wrapper:not(.show) {
  transform: translate3d(0, 100%, 0);
}

.info-wrapper .fixed-title {
  position: fixed;
  top: 0;
  width: 100%;
  height: 40px;
  z-index: 100;
  text-align: center;
  background-color: #f5f5f5;
  color: #333;
}

.info-wrapper .fixed-title .back {
  position: absolute;
  top: 0px;
  left: 6px;
  z-index: 50;
}

.info-wrapper .fixed-title .back .icon-close {
  display: block;
  padding: 11px;
  font-size: 18px;
}

.info-wrapper .fixed-title .type {
  display: inline-block;
  padding-top: 12px;
  font-size: 16px;
}

.info-wrapper .celebrity-info {
  position: fixed;
  top: 0;
  width: 100%;
  bottom: 0;
}

.info-wrapper .celebrity-info .scroll-wrapper {
  padding: 50px 20px 10px 20px;
  color: #333;
}

.info-wrapper .celebrity-info .scroll-wrapper .name {
  margin-top: 30px;
  font-size: 18px;
  font-weight: 600;
}

.info-wrapper .celebrity-info .scroll-wrapper .name-en {
  margin-top: 10px;
  font-size: 12px;
}

.info-wrapper .celebrity-info .scroll-wrapper .info-lists {
  padding: 20px 0;
  font-size: 14px;
}

.info-wrapper .celebrity-info .scroll-wrapper .info-lists div {
  line-height: 25px;
  font-size: 0;
}

.info-wrapper .celebrity-info .scroll-wrapper .info-lists div span {
  vertical-align: middle;
  font-size: 14px;
  /* $font-size-medium */
}

.info-wrapper .celebrity-info .scroll-wrapper .info-lists div .item {
  display: inline-block;
  width: 80px;
}

.info-wrapper .celebrity-info .scroll-wrapper .info-lists .more-name {
  display: flex;
  align-items: flex-start;
}

.info-wrapper .celebrity-info .scroll-wrapper .info-lists .more-name .item {
  flex: 0 0 80px;
  width: 80px;
}

.info-wrapper .celebrity-info .scroll-wrapper .info-lists .more-name .more {
  flex: 1;
}

.info-wrapper .celebrity-info .scroll-wrapper .summary {
  font-size: 14px;
  line-height: 22px;
}

/* 滑动动画 */
.info-wrapper.slide-enter-active,
.info-wrapper.slide-leave-active {
  transition: all 0.3s;
}

.info-wrapper.slide-enter-from,
.info-wrapper.slide-leave-to {
  transform: translate3d(0, 100%, 0);
}
</style>