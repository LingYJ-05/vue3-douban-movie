<template>
  <div class="rank-list">
    <ul>
      <!-- 遍历父组件传来的 rankItems 数组，为每个电影生成一个列表项 -->
      <li class="rank-item" v-for="(item, index) in rankItems" :key="item.id" @click="selectItem(item)">
        <!-- 如果需要显示排名 (needRank=true)，则显示排名 -->
        <div class="rank-rating" v-if="needRank">
          <span class="text">{{ page * 50 + index + 1 }}</span>
        </div>
        <!-- 电影信息容器 -->
        <div class="rank-info" :class="{ 'compact': !needRank }">
          <!-- 电影海报 -->
          <div class="info-img">
            <!-- 使用图片代理服务处理防盗链 -->
            <img :src="replaceUrl(item.images)" height="100" width="70" alt="电影海报" />
          </div>
          <!-- 电影文字信息 -->
          <div class="info-desc">
            <p class="title">{{ item.title }}</p>
            <!-- 显示评分星星组件 -->
            <Star :size="24" :score="item.rating.average" :showScore="true" />
            <!-- 显示导演信息 -->
            <div class="director">
              导演：{{ item.directors && item.directors[0] ? item.directors[0].name : '未知' }}
            </div>
            <!-- 显示主演信息 -->
            <div class="actor">
              主演：{{ formatActors(item.casts) }}
            </div>
          </div>
        </div>
      </li>
    </ul>
    <!-- 如果有更多数据且需要加载更多，则显示加载组件 -->
    <LoadMore :hasMore="hasMore" v-if="hasMore && needLoading" />
  </div>
</template>

<script setup>
// 1. 导入子组件
import Star from '../../base/star/star.vue';
import LoadMore from '../../base/loadmore/loadmore.vue';

// 2. 定义接收的 props
const props = defineProps({
  rankItems: { type: Array, default: () => [] }, // 电影列表数据
  hasMore: { type: Boolean, default: false },   // 是否还有更多数据
  needLoading: { type: Boolean, default: true }, // 是否需要显示加载更多
  needRank: { type: Boolean, default: true },    // 是否需要显示排名
  page: { type: Number, default: 0 },            // 当前页码 (用于计算排名)
});

// 3. 定义向父组件发送的事件
const emit = defineEmits(['select']); // 当点击电影项时触发

// 4. 方法

// 格式化主演信息
const formatActors = (casts) => {
  if (!casts || !Array.isArray(casts) || casts.length === 0) {
    return '未知';
  }
  // 取前两个演员的名字并用 '/' 连接
  return casts.slice(0, 2).map(actor => actor.name).join(' / ');
};

// 处理图片防盗链
const replaceUrl = (srcUrlObj) => {
  // 检查图片对象是否存在且有 large 属性
  if (!srcUrlObj || typeof srcUrlObj !== 'object' || !srcUrlObj.large) {
    // 如果没有图片，可以返回一个默认图片的 URL 或空字符串
    return ''; // 或者 return '/path/to/default-image.jpg';
  }
  // 使用 weserv.nl 代理服务处理图片防盗链
  // 将原始 URL (可能包含 http 或 https) 的协议部分去掉
  const originalUrl = srcUrlObj.large.replace(/^https?:\/\//, '');
  // 构造代理 URL
  return `https://images.weserv.nl/?url=${originalUrl}`;
};

// 处理点击事件，向父组件发送选中的电影
const selectItem = (movie) => {
  // 触发 'select' 事件，并将选中的电影数据传递给父组件
  emit('select', movie);
};
</script>
<style scoped>
.rank-item {
    padding-top: 30px;
}

.rank-item.compact {
    padding-top: 0px;
}

.rank-rating {
    position: relative;
    margin: 30px auto;
    text-align: center;
    height: 10px;
    width: 50%;
}

.rank-rating .line {
    border-bottom: 1px solid #ccc;
}

.rank-rating .text {
    padding: 0 10px;
    display: inline-block;
    background-color: #fff;
    /* $color-background */
    position: absolute;
    left: 50%;
    top: -8px;
    transform: translateX(-50%);
    font-size: 16px;
    /* $font-size-large */
    color: #ff4d4d;
    /* $color-theme-f */
}

.rank-info {
    display: flex;
    align-items: top;
    box-sizing: border-box;
    height: 130px;
    padding: 15px;
    border: 1px solid #e0e0e0;
    /* $color-line */
}

.rank-info.compact {
    border: 0;
    border-bottom: 1px solid #e0e0e0;
    /* $color-line */
}

.info-img {
    flex: 0 0 70px;
    margin-right: 10px;
}

.info-desc {
    flex: 1;
    box-sizing: border-box;
    height: 100px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
}

.info-desc .title {
    font-size: 16px;
    /* $font-size-medium-x */
    color: #333;
    /* $color-text-f */
    margin: 0;
}

.info-desc .director {
    font-size: 14px;
    /* $font-size-small */
}

.info-desc .casts {
    font-size: 14px;
    /* $font-size-small */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.rank-item:last-child {
    margin-bottom: 30px;
}
</style>