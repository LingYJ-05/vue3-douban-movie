<template>
  <div class="works-wrapper">
    <!-- 固定标题栏 -->
    <div class="fixed-title">
      <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
      <span class="type">全部作品</span>
      <span class="to-top" @click="toTop">
        <i class="icon-circle-up"></i>
      </span>
    </div>
    
    <!-- 滚动容器 -->
    <scroll 
      class="celebrity-works" 
      :data="works" 
      :pullup="pullup" 
      @scrollToEnd="loadMore" 
      ref="scrollRef"
    >
      <div class="scroll-wrapper">
        <rank-list 
          :rankItems="works" 
          :needRank="needRank" 
          @select="selectMovie" 
          :hasMore="hasMore"
        ></rank-list>
      </div>
    </scroll>
    
    <!-- 加载动画 -->
    <loadmore :fullScreen="fullScreen" v-if="!works.length"></loadmore>
  </div>
</template>

<script setup>
// 1. 导入需要的模块
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Scroll from 'base/scroll/scroll';
import RankList from 'components/rank-list/rank-list';
import Loadmore from 'base/loadmore/loadmore';
import { getCelebrityWorks } from '../../api/celebrity';
import { createRankList } from '../../common/js/movieList';

// 2. 常量定义
const SEARCH_MORE = 20;

// 3. 创建响应式数据
const needRank = ref(false);
const searchIndex = ref(0);
const works = ref([]);
const fullScreen = ref(true);
const hasMore = ref(true);
const pullup = ref(true);
const loadingFlag = ref(true); // 控制滚动加载速度

// 4. 创建引用
const scrollRef = ref(null);

// 5. 创建路由和store实例
const router = useRouter();
const store = useStore();

// 6. 计算属性
const currentCelebrityId = computed(() => store.getters.currentCelebrityId);

// 7. 方法定义

// 返回上一页
const back = () => {
  router.back();
};

// 返回顶部
const toTop = () => {
  if (scrollRef.value && scrollRef.value.scrollTo) {
    scrollRef.value.scrollTo(0, 0, 200); // 滚动到顶部，带动画效果
  }
};

// 选择电影
const selectMovie = (movie) => {
  store.commit('SET_MOVIE', movie);
  router.push({
    path: `/movie/${movie.id}`
  });
};

// 加载更多
const loadMore = () => {
  // 如果正在加载或没有更多数据，直接返回
  if (!loadingFlag.value || !hasMore.value) {
    return;
  }
  
  // 开始加载
  loadingFlag.value = false;
  searchIndex.value += SEARCH_MORE; // 增加查找索引
  
  // 获取数据
  getCelebrityWorks(currentCelebrityId.value, searchIndex.value, SEARCH_MORE)
    .then((res) => {
      let ret = [];
      res.works?.forEach((item) => {
        ret.push(item.subject);
      });
      works.value = works.value.concat(createRankList(ret));
      _checkMore(res);
      loadingFlag.value = true;
    });
};

// 获取作品列表
const _getWorks = () => {
  if (!currentCelebrityId.value) { // 当前页面浏览器刷新跳转回主页
    router.push('/movie-show');
    return;
  }
  
  getCelebrityWorks(currentCelebrityId.value, searchIndex.value, SEARCH_MORE)
    .then((res) => {
      let ret = [];
      res.works?.forEach((item) => {
        ret.push(item.subject);
      });
      works.value = createRankList(ret);
      _checkMore(res);
      // console.log(res);
    });
};

// 检查是否还有更多数据
const _checkMore = (data) => {
  let worksList = data.works || [];
  if (!worksList.length || data.start + data.count >= data.total) {
    hasMore.value = false;
  }
};

// 8. 组件挂载后执行
onMounted(() => {
  _getWorks();
});
</script>

<style scoped>
.works-wrapper {
  height: 100%;
  position: relative;
  z-index: 800;
  background-color: #f5f5f5; 
}

.works-wrapper .fixed-title {
  position: fixed;
  top: 0;
  width: 100%;
  height: 50px;
  z-index: 200;
  background-color: #f5f5f5; 
  text-align: center;
  position: relative;
}

.works-wrapper .fixed-title::after {
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

.works-wrapper .fixed-title .back {
  position: absolute;
  top: 0px;
  left: 6px;
  z-index: 50;
}

.works-wrapper .fixed-title .back .icon-back {
  display: block;
  padding: 15px;
  font-size: 18px; 
  color: #ff4500; 
}

.works-wrapper .fixed-title .type {
  line-height: 50px;
  font-size: 16px;
}

.works-wrapper .fixed-title .to-top {
  position: absolute;
  top: 0;
  right: 6px;
  z-index: 50;
}

.works-wrapper .fixed-title .to-top .icon-circle-up {
  display: block;
  padding: 15px;
  font-size: 20px; 
  color: #ff4500; 
}
.works-wrapper .celebrity-works {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: #f5f5f5; 
}

.works-wrapper .celebrity-works .scroll-wrapper {
  padding: 50px 0 30px 0;
}
</style>