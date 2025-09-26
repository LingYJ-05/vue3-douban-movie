<template>
  <div class="star">
    <span v-if="score || needNullStar" v-for="item in itemClasses" :class="['star-item', item, `star-${size}`]"></span>
    <span class="no-score" v-if="!score" :class="{ 'block': needNullStar }">暂无评分</span>
    <span class="show-score" v-if="showScore && score">{{ normalizeScore }}</span>
  </div>
</template>

<script setup name="Star">
import { ref, computed } from 'vue'

// 星星相关常量
const LENGTH = ref(5)
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

// 定义组件属性
const props = defineProps({
  score: {
    type: Number,
    default: 0
  },
  size: {
    type: Number,
    default: 16
  },
  showScore: {
    type: Boolean,
    default: true
  },
  needNullStar: {
    type: Boolean,
    default: false
  }
})
const normalizeScore = computed(() => {   // 归一化评分
  let len = props.score.toString().length
  if (len < 2) {   //如果评分只有一位数，补全为xx.0 例如8分为8.0
    return `${props.score}.0`
  }
  return props.score
})
const itemClasses = computed(() => {   // 计算每个星星的类名
  let result = []  // 星星的类名数组
  // 直接将评分除以2，因为满分是10分，对应5颗星
  let score = props.score / 2
  // 保留一位小数，方便判断是否需要显示半星
  let roundedScore = Math.round(score * 10) / 10
  // 计算全星数量（整数部分）
  let fullStars = Math.floor(roundedScore)
  // 判断是否有半星（如果小数部分大于0.3，显示半星）
  let hasHalfStar = roundedScore % 1 >= 0.3
  
  // 添加全星
  for (let i = 0; i < fullStars; i++) {
    result.push(CLS_ON)
  }
  
  // 添加半星（如果需要）
  if (hasHalfStar && result.length < LENGTH.value) {
    result.push(CLS_HALF)
  }
  
  // 填充剩余的空星
  while (result.length < LENGTH.value) {
    result.push(CLS_OFF)
  }
  
  return result
})
</script>


<style scoped>
.star {
  display: flex;
  align-items: center;
  gap: 4px;

  .no-score {
    font-size: 14px;
    color: #999;
    font-weight: 400;
  }

  .block {
    display: block;
    font-size: 14px;
    color: #999;
    text-align: center;
    padding: 10px 0;
    width: 100%;
  }

  .show-score {
    display: inline-block;
    font-size: 12px;
    color: #9b9b9b;
    font-weight: 500;
    margin-left: 6px;
    line-height: 1;
  }

  .star-item {
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    vertical-align: middle;
    transition: transform 0.2s ease;
  }

  .star-item:hover {
    transform: scale(1.1);
  }

  .star-item.star-24 {
    height: 12px;
    width: 12px;
    margin-right: 2px;
    background-size: 12px 12px;

    &:last-child {
      margin-right: 0;
    }

    &.on {
      background-image: url('/src/assets/images/star-on.svg');
    }

    &.half {
      background-image: url('/src/assets/images/star-half.svg');
    }

    &.off {
      background-image: url('/src/assets/images/star-off.svg');
      opacity: 0.3;
    }
  }

  .star-item.star-36 {
    height: 18px;
    width: 18px;
    margin-right: 3px;
    background-size: 18px 18px;

    &:last-child {
      margin-right: 0;
    }

    &.on {
      background-image: url('/src/assets/images/star-on.svg');
    }

    &.half {
      background-image: url('/src/assets/images/star-half.svg');
    }

    &.off {
      background-image: url('/src/assets/images/star-off.svg');
      opacity: 0.3;
    }
  }
}
</style>
