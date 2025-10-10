```vue
<template>
  <div class="movie-show">
    <!-- 搜索框 -->
    <div class="go-search" @click="goSearch">
      <div class="logo">
        <img src="./douban-logo.png" width="35" height="35" alt="豆瓣logo" @error="handleError">
      </div>
      <div class="search-content">
       <el-icon class="search-icon"><Search /></el-icon>
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
import { Search } from '@element-plus/icons-vue'
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

// 滚动相关状态
const fullScreen = ref(false)
const loading = ref(false)
const error = ref('')
const currentIndex = ref(0)
const fixedTitle = ref('')
// const needDate = ref(true)

// 滚动组件配置
const scrollProps = {
  pullup: true,
  probeType: 3,
  listenScroll: true
}

// 保存滚动组件引用
const scrollComponent = ref(null)

// 滚动相关状态
const scorllY = ref(-1)           // 当前滚动位置
const scrollIndex = ref(0)        // 当前滚动到的索引
const listHeight = ref([])        // 每个分组的高度数组
const fixedTop = ref(0)           // 固定标题的偏移量
const scorllMap = ref(null)       // 滚动映射数据
const refs = ref({})              // DOM引用

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

// 滚动相关方法
// 保存滚动组件传入的高度
const getHeight = (height) => {
  listHeight.value = height
}

// 保存子组件传入的日期映射
const getMap = (map) => {
  scorllMap.value = map
}

// 滚动事件处理
const scroll = (e) => {
  scorllY.value = e.detail.y
}

// 监听滚动位置变化，计算当前索引和固定标题
watch(scorllY, (newY) => {
  if (!newY) { // 如果在快速滚动时切换tab栏，滚动位置会读取错误，这里保留出错前正确的滚动位置
    return
  }
  if (!listHeight.value || !scorllMap.value) {
    return
  }
  
  if (newY > 0) {
    scrollIndex.value = 0
    return
  }
  
  // 在中间部分滚动
  if (Array.isArray(listHeight.value) && listHeight.value.length > 1) {
    for (let i = 0; i < listHeight.value.length - 1; i++) {
      let height1 = listHeight.value[i] // 上一个元素的高度
      let height2 = listHeight.value[i + 1] // 下一个元素的高度
      if (-newY >= height1 && -newY < height2) {
        scrollIndex.value = i
        
        // 更新固定标题
        updateFixedTitle(i)
        return
      }
    }
    // 滚动到底部 且newY大于最后一个元素的上限
    scrollIndex.value = listHeight.value.length - 2
    
    // 更新固定标题
    updateFixedTitle(listHeight.value.length - 2)
  }
})

// 更新固定标题
const updateFixedTitle = (index) => {
  if (scorllMap.value && currentIndex.value === 1) {
    const keys = Object.keys(scorllMap.value)
    if (keys.length > 0 && index < keys.length) {
      fixedTitle.value = keys[index]
    }
  }
}

// 计算固定标题的位置（吸顶效果）
const diff = (newval) => {
  let tempFixedTop = (newval > 0 && newval < CONFIG.TITLE_HEIGHT) ? 
    newval - CONFIG.TITLE_HEIGHT : 0
  
  if (fixedTop.value === tempFixedTop) {
    return
  }
  
  fixedTop.value = tempFixedTop
  nextTick(() => {
    if (refs.value.fixed) {
      refs.value.fixed.style.transform = `translate3d(0, ${tempFixedTop}px, 0)`
    }
  })
}

// 监听scrollIndex变化，计算固定标题位置
watch(scrollIndex, (newIndex) => {
  if (currentIndex.value === 1 && listHeight.value.length > 0) {
    const newY = -listHeight.value[newIndex]
    diff(newY)
  }
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
  
  // 切换标签时重置滚动相关状态
  scorllY.value = -1
  scrollIndex.value = 0
  fixedTitle.value = ''
  
  loadMovies(index) // 加载对应数据
  refreshScroll()
}

// 加载更多数据
// 判断目前是加载热映还是加载即将上映的电影
const loadingListType= currentIndex.value===0?'hot':'coming'
const loadMoreData = () => {
  if (loading.value || !hasMoreMovies[loadingListType]) {
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
  font-size: 16px;
  line-height: 35px;
  border-radius: 5px;
}

.movie-show .go-search .search-content span {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 5px;
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
