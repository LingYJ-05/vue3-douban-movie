<template>
  <div class="works-wrapper">
    <!-- 固定标题栏 -->
    <div class="fixed-title">
      <el-button 
        class="back-btn" 
        @click="back" 
        icon="el-icon-arrow-left"
        circle
        size="small"
      ></el-button>
      <span class="type">全部作品</span>
      <el-button 
        class="to-top-btn" 
        @click="toTop" 
        icon="el-icon-top"
        circle
        size="small"
      ></el-button>
    </div>
    
    <!-- 滚动容器 -->
    <el-scrollbar 
      class="celebrity-works" 
      ref="scrollbarRef"
      @scroll="handleScroll"
    >
      <div class="scroll-wrapper">
        <rank-list 
          :rankItems="works" 
          :needRank="needRank" 
          @select="selectMovie" 
          :hasMore="hasMore"
        ></rank-list>
        
        <!-- 加载更多 -->
        <div v-if="loadingFlag" class="loading-more">
          <el-loading v-loading="loadingFlag" element-loading-text="加载中..."></el-loading>
        </div>
      </div>
    </el-scrollbar>
    
    <!-- 加载动画 -->
    <el-loading v-if="!works.length" fullscreen text="加载中..."></el-loading>
  </div>
</template>

<script setup>
// 1. 导入需要的模块
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElScrollbar, ElButton, ElLoading } from 'element-plus';
import { ArrowLeft, Top } from '@element-plus/icons-vue';
import RankList from 'components/rank-list/rank-list';
import { getCelebrityWorks } from '../../api/celebrity';
import { createRankList } from '../../common/js/movieList';

// 2. 常量定义
const SEARCH_MORE = 20;

// 3. 创建响应式数据
const needRank = ref(false);
const searchIndex = ref(0);
const works = ref([]);
const hasMore = ref(true);
const loadingFlag = ref(true); // 控制滚动加载速度

// 4. 创建引用
const scrollbarRef = ref(null);

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
  if (scrollbarRef.value && scrollbarRef.value.wrapRef) {
    scrollbarRef.value.wrapRef.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

// 选择电影
const selectMovie = (movie) => {
  store.commit('SET_MOVIE', movie);
  router.push({
    path: `/movie/${movie.id}`
  });
};

// 处理滚动事件
const handleScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target;
  // 当滚动到距离底部100px时触发加载更多
  if (scrollHeight - scrollTop - clientHeight < 100) {
    loadMore();
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.works-wrapper .fixed-title .back-btn {
  position: absolute;
  left: 10px;
  color: #ff4500;
}

.works-wrapper .fixed-title .type {
  font-size: 16px;
  font-weight: 500;
}

.works-wrapper .fixed-title .to-top-btn {
  position: absolute;
  right: 10px;
  color: #ff4500;
}

.works-wrapper .celebrity-works {
  height: 100%;
  padding-top: 50px;
}

.works-wrapper .celebrity-works .scroll-wrapper {
  padding-bottom: 30px;
}

.loading-more {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
</style>