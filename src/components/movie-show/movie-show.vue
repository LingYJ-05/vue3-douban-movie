<template>
  <div class="movie-show">
    <!-- 搜索框 -->
    <div class="go-search" @click="goSearch">
      <div class="logo">
        <img src="./douban-logo.png" width="35" height="35" alt="豆瓣logo" @error="handleError">
      </div>
      <div class="search-content">
        <el-icon class="search-icon">
          <Search />
        </el-icon>
        <span>电影/影人/标签</span>
      </div>
    </div>

    <!-- 标签切换 - 使用 Element Plus Tabs，平均分布 -->
    <el-tabs v-model="currentIndex" type="card" @tab-change="switchItem" class="movie-tabs">
      <el-tab-pane label="正在热映" name="0"></el-tab-pane>
      <el-tab-pane label="即将上映" name="1"></el-tab-pane>
    </el-tabs>

    <!-- 内容列表 -->
    <div class="list-wrapper">
      <!-- 错误提示 -->
      <el-empty v-if="error && !loading" description="加载失败，请重试">
        <template #bottom>
          <el-button type="primary" @click="retryLoad">重试</el-button>
        </template>
      </el-empty>

      <!-- 热映电影 -->
      <div v-else-if="currentIndex === '0'" class="list-container">
        <div v-infinite-scroll="loadMoreData" :infinite-scroll-disabled="loading || !hasMoreMovies.hot"
          :infinite-scroll-distance="50" class="list-inner">
          <movie-list :movies="moviesData.hot" :needDate="false" @select="selectMovie"></movie-list>
          <!-- 加载中 -->
          <el-skeleton v-if="loading" :rows="3" animated class="loading-skeleton"></el-skeleton>
        </div>
      </div>

      <!-- 即将上映 -->
      <div v-else-if="currentIndex === '1'" class="list-container">
        <div v-infinite-scroll="loadMoreData" :infinite-scroll-disabled="loading || !hasMoreMovies.coming"
          :infinite-scroll-distance="50" class="list-inner">
          <movie-list :movies="moviesData.coming" :needDate="true" @select="selectMovie"></movie-list>
          <!-- 加载中 -->
          <el-skeleton v-if="loading" :rows="3" animated class="loading-skeleton"></el-skeleton>
        </div>
      </div>
    </div>

    <!-- 即将上映时的固定标题 -->
    <div v-if="currentIndex === '1' && fixedTitle" class="fixed-title-bar">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import movieList from '../../components/movie-list/movie-list.vue'
import { ref, reactive, watch } from 'vue'
import router from '../../router'
import { getMovie, getComingSoon } from '../../api/movie-show.js'

// 集中管理所有电影数据
const moviesData = reactive({
  hot: [],      // 热映电影
  coming: []    // 即将上映
})

// 集中管理加载状态
const hasMoreMovies = reactive({
  hot: true,
  coming: true
})

// 滚动相关状态
const loading = ref(false)
const error = ref('')
const currentIndex = ref('0') // 使用字符串类型与Element Plus的tabs组件兼容
const fixedTitle = ref('')

// 电影加载配置
const CONFIG = {
  SEARCH_MORE: 10
}

// API映射 - 用对象统一管理
const apiMap = {
  '0': (start, count) => getMovie(start, count),  // 热映
  '1': (start, count) => getComingSoon(start, count)  // 即将上映
}

// 索引管理
const indexMap = reactive({
  hot: 0,
  coming: 0
})

// 统一的加载方法
const loadMovies = async (tabIndex, isLoadMore = false) => {
  try {
    loading.value = true
    error.value = ''

    // 计算起始位置
    const start = isLoadMore ?
      (tabIndex === '0' ? indexMap.hot : moviesData.coming.length) : 0

    // 获取数据
    const res = await apiMap[tabIndex](start, CONFIG.SEARCH_MORE)

    // 更新数据
    const key = tabIndex === '0' ? 'hot' : 'coming'
    if (isLoadMore) {
      moviesData[key] = [...moviesData[key], ...res.subjects || []]
    } else {
      moviesData[key] = res.subjects || []
    }

    // 更新索引
    if (tabIndex === '0' && isLoadMore) {
      indexMap.hot += CONFIG.SEARCH_MORE
    }

    // 检查是否还有更多数据
    checkHasMore(res, key)

  } catch (err) {
    console.error('加载电影失败:', err)
    error.value = '加载失败，请重试'
  } finally {
    loading.value = false
  }
}

// 检查是否还有更多数据
const checkHasMore = (res, key) => {
  const movies = res?.subjects || []
  if (!res || movies.length === 0 ||
    (res.start !== undefined && res.count !== undefined &&
      res.total !== undefined && (res.start + res.count) >= res.total)) {
    hasMoreMovies[key] = false
  }
}

// 切换标签
const switchItem = (index) => {
  currentIndex.value = index

  // 切换标签时重置固定标题
  fixedTitle.value = ''

  // 如果切换到一个新的标签页且该标签页没有数据，则加载数据
  const key = index === '0' ? 'hot' : 'coming'
  if (moviesData[key].length === 0) {
    loadMovies(index) // 加载对应数据
  }
}

// 加载更多数据
const loadMoreData = () => {
  if (loading.value || !hasMoreMovies[currentIndex.value === '0' ? 'hot' : 'coming']) {
    return
  }
  loadMovies(currentIndex.value, true)
}

// 重试加载
const retryLoad = () => {
  error.value = ''
  loadMovies(currentIndex.value)
}

// 处理图片错误
const handleError = (e) => {
  e.target.src = 'https://picsum.photos/80/120'
}

// 搜索功能
const goSearch = () => {
  router.push('/search')
}

// 选择电影
const selectMovie = (movie) => {
  router.push({ name: 'movieDetail', params: { id: movie.id } })
}

// 组件初始化
loadMovies('0') // 默认加载热映电影
</script>

<style scoped>
.movie-show {
  height: 100%;
  padding-bottom: 60px;
  background-color: #f5f5f5;
}

/* 搜索框样式 */
.go-search {
  height: 50px;
  box-sizing: border-box;
  padding: 10px 10px 5px 60px;
  text-align: center;
  position: relative;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.logo {
  position: absolute;
  left: 10px;
  top: 10px;
}

.search-content {
  background-color: #f5f5f5;
  font-size: 14px;
  line-height: 35px;
  border-radius: 17.5px;
  padding: 0 20px;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-content span {
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
}

/* Element Plus Tabs 组件样式 - 平均分布 */
.movie-tabs {
  padding: 0 15px;
  margin-bottom: 10px;
  background-color: #fff;
}

.movie-tabs .el-tabs__header {
  margin-bottom: 0;
  border-bottom: none;
}

.movie-tabs .el-tabs__nav-wrap {
  padding: 0;
}

.movie-tabs .el-tabs__nav {
  width: 100%;
  display: flex;
}

.movie-tabs .el-tabs__item {
  flex: 1;
  /* ✅ 关键：平均分布 */
  text-align: center;
  font-size: 14px;
  color: #666;
  height: 40px;
  line-height: 40px;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 20px;
  background-color: #f5f5f5;
  margin: 0 5px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.movie-tabs .el-tabs__item.is-active {
  color: #fff;
  background-color: #409EFF;
  transform: scale(1.05);
}

.movie-tabs .el-tabs__item:not(.is-active):hover {
  background-color: #e6f7ff;
}

.movie-tabs .el-tabs__active-bar {
  display: none;
  /* 隐藏默认的下划线 */
}

/* 列表容器样式 */
.list-wrapper {
  padding: 0 15px;
  min-height: calc(100vh - 150px);
}

.list-container {
  width: 100%;
}

.list-inner {
  width: 100%;
  padding-bottom: 20px;
}

/* 加载骨架屏样式 */
.loading-skeleton {
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 固定标题栏 */
.fixed-title-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 0 15px;
  border-top: 1px solid #eee;
}

.fixed-title {
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  padding: 0;
  color: #333;
  background-color: #f9f9f9;
  border-radius: 4px;
  text-align: center;
}
</style>