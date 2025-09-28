<template>
  <div class="movie-show">
    <!-- 搜索框 -->
    <div class="go-search" @click="goSearch">
      <div class="logo">
        <img src="./douban-logo.png" width="35" height="35" alt="豆瓣logo" @error="handleError">
      </div>
      <div class="search-content">
        <span class="icon-search">🔍</span>
        <span>电影/影人/标签</span>
      </div>
    </div>

    <!-- 标签切换 -->
    <Switches :items="switches" :currentIndex="currentIndex" @switch="switchItem"></Switches>
    
    <!-- 内容列表 -->
    <div class="list-wrapper">
      <!-- 热映电影 -->
      <Scroll v-show="currentIndex === 0" class="list-scroll" 
              :data="moviesData.hot" v-bind="scrollProps" 
              @scroll="scroll" @pullingUp="loadMoreData" ref="scrollComponent">
        <div class="list-inner">
          <movie-list :movies="moviesData.hot" :needDate="false" 
                      @getHeight="getHeight" @getMap="getMap"
                      :hasMore="hasMoreMovies.hot" 
                      @select="selectMovie" ref="list"></movie-list>
        </div>
      </Scroll>

      <!-- 即将上映 -->
      <Scroll v-show="currentIndex === 1" class="list-scroll" 
              :data="moviesData.coming" v-bind="scrollProps" 
              @scroll="scroll" @pullingUp="loadMoreData" ref="scrollComponent">
        <div class="list-inner">
          <movie-list :movies="moviesData.coming" :needDate="true" 
                      @getHeight="getHeight" @getMap="getMap"
                      :hasMore="hasMoreMovies.coming" 
                      @select="selectMovie" ref="list"></movie-list>
        </div>
      </Scroll>
      
      <!-- 加载更多 -->
      <LoadMore :fullScreen="fullScreen" :hasMore="loading" v-show="loading"></LoadMore>

      <!-- 错误提示 -->
      <div class="error-tip" v-show="error && !loading">
        <p>{{ error }}</p>
        <button @click="retryLoad" class="retry-btn">重试</button>
      </div>
    </div>
    
    <div class="list-fixed" v-show="currentIndex === 1" v-if="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
  </div>
</template>

<script setup>
import Switches from '../../base/switches/switches.vue'
import LoadMore from '../../base/loadmore/loadmore.vue'
import movieList from '../../components/movie-list/movie-list.vue'
import Scroll from '../../base/scroll/scroll.vue'
import { ref, reactive, watch, nextTick } from 'vue'
import router from '../../router'
import { getMovie, getComingSoon } from '../../api/movie-show.js'

// 数据结构优化
const switches = ref([
  { name: '正在热映' },
  { name: '即将上映' }
])

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

// 其他状态
const loading = ref(false)
const error = ref('')
const currentIndex = ref(0)
const fixedTitle = ref('')
const needDate = ref(true)

// 滚动组件配置
const scrollProps = {
  pullup: true,
  probeType: 3,
  listenScroll: true
}

// 保存滚动组件引用
const scrollComponent = ref(null)

// 电影加载配置
const CONFIG = {
  SEARCH_MORE: 10,
  TITLE_HEIGHT: 30
}

// API映射 - 用对象统一管理
const apiMap = {
  0: (start, count) => getMovie(start, count),  // 热映
  1: (start, count) => getComingSoon(start, count)  // 即将上映
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
      (tabIndex === 0 ? indexMap.hot : moviesData.coming.length) : 0
    
    // 获取数据
    const res = await apiMap[tabIndex](start, CONFIG.SEARCH_MORE)
    
    // 更新数据
    const key = tabIndex === 0 ? 'hot' : 'coming'
    if (isLoadMore) {
      moviesData[key] = [...moviesData[key], ...res.subjects || []]
    } else {
      moviesData[key] = res.subjects || []
    }
    
    // 更新索引
    if (tabIndex === 0 && isLoadMore) {
      indexMap.hot += CONFIG.SEARCH_MORE
    }
    
    // 检查是否还有更多数据
    checkHasMore(res, key)
    
  } catch (err) {
    console.error('加载电影失败:', err)
    error.value = '加载失败，请重试'
    // 可以在这里设置模拟数据
  } finally {
    loading.value = false
    finishPullUp()
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

// 完成上拉加载
const finishPullUp = () => {
  if (scrollComponent.value?.scroll) {
    scrollComponent.value.scroll.finishPullUp()
  }
}

// 切换标签
const switchItem = (index) => {
  currentIndex.value = index
  loadMovies(index) // 加载对应数据
  refreshScroll()
}

// 加载更多数据
const loadMoreData = () => {
  if (loading.value || !hasMoreMovies[currentIndex.value === 0 ? 'hot' : 'coming']) {
    return
  }
  
  loadMovies(currentIndex.value, true)
}

// 刷新滚动组件
const refreshScroll = () => {
  if (scrollComponent.value) {
    setTimeout(() => {
      scrollComponent.value.refresh()
    }, 20)
  }
}

// 重试加载
const retryLoad = () => {
  error.value = ''
  loadMovies(currentIndex.value)
}

// 处理图片错误
const handleError = (e) => {
  e.target.src = 'https://via.placeholder.com/80x120?text=电影海报'
}

// 滚动事件
const scroll = (e) => {
  // 滚动相关逻辑保持不变
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
loadMovies(0) // 默认加载热映电影
</script>
<style scoped>
.movie-show {
  height: 100%;
}

.movie-show .go-search {
  height: 50px;
  box-sizing: border-box;
  padding: 10px 10px 5px 60px;
  text-align: center;
}

.movie-show .go-search .logo {
  position: absolute;
  left: 10px;
}

.movie-show .go-search .search-content {
  background-color: #f5f5f5;
  /* $color-background-d */
  font-size: 16px;
  /* $font-size-medium-x */
  line-height: 35px;
  border-radius: 5px;
}

.movie-show .go-search .search-content span {
  display: inline-block;
  vertical-align: middle;
}

.movie-show .list-wrapper {
  position: absolute;
  top: 97px;
  bottom: 61px;
  width: 100%;
}

.movie-show .list-wrapper .list-scroll {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.movie-show .list-wrapper .list-scroll .list-inner {
  padding: 0px 15px;
}

.movie-show .list-fixed {
  position: absolute;
  top: 97px;
  right: 15px;
  left: 15px;
}

.movie-show .list-fixed .fixed-title {
  width: 100%;
  padding-left: 5px;
  height: 30px;
  line-height: 30px;
  background-color: #f5f5f5;
  /* $color-background-d */
}

/* 错误提示样式 */
.error-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #999;
}

.error-tip p {
  margin-bottom: 10px;
}

.error-tip .retry-btn {
  background-color: #00a0e9;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 5px 15px;
  cursor: pointer;
}
</style>
