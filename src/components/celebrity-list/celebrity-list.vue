<template>
  <div class="celebrity-list">
    <ul>
      <li class="celebrity-item" v-for="item in celebrities" :key="item.id" @click="selectItem(item.id)">
        <div class="image">
          <img v-lazy="replaceUrl(item.image)" class="" height="100" width="70">
        </div>
        <div class="desc">
          <p class="title">{{ item.name }}</p>
          <div class="works">代表作: {{ item.works }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
// 1. 导入需要的模块
import { defineProps, defineEmits } from 'vue';

// 2. 定义props
const props = defineProps({
  celebrities: {
    type: Array,
    default: () => []
  }
});

// 3. 定义emit事件
const emit = defineEmits(['select']);

// 4. 方法定义
// 选择影人
const selectItem = (id) => {
  emit('select', id); // 触发父组件的select事件
};

// 图片URL处理（防盗链）
const replaceUrl = (srcUrl) => {
  if (srcUrl) {
    return 'https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, '');
  }
  return '';
};
</script>

<style scoped>
.celebrity-item {
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
  height: 130px;
  padding: 15px;
  background: #f5f5f5;
  position: relative;
}

.celebrity-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #e0e0e0;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}

.celebrity-item .image {
  flex: 0 0 70px;
  margin-right: 10px;
}

.celebrity-item .desc {
  flex: 1;
  box-sizing: border-box;
}

.celebrity-item .desc .title {
  font-size: 16px;
  color: #333;
}

.celebrity-item .desc .works {
  margin-top: 10px;
  font-size: 14px;
  line-height: 20px;
}
</style>