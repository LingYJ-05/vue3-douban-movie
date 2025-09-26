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
      <!-- 正在热映 -->
      <Scroll v-show="currentIndex === 0" class="list-scroll" :data="hotMovies" :pullup="pullup"
        :probeType="listProbeType" :listenScroll="listenScroll" @scroll="scroll" @pullingUp="loadMoreData" ref="scrollComponent">
        <div class="list-inner">
          <movie-list :movies="hotMovies" :needDate="false" @getHeight="getHeight" @getMap="getMap"
            :hasMore="hasMoreHotMovies" @select="selectMovie" ref="list"></movie-list>
        </div>
      </Scroll>

      <!-- 即将上映 -->
      <Scroll v-show="currentIndex === 1" class="list-scroll" :data="comingMovies" :pullup="pullup"
        :probeType="listProbeType" :listenScroll="listenScroll" @scroll="scroll" @pullingUp="loadMoreData" ref="scrollComponent">
        <div class="list-inner">
          <movie-list :movies="comingMovies" :needDate="needDate" @getHeight="getHeight" @getMap="getMap"
            :hasMore="hasMoreComingMovies" @select="selectMovie" ref="list"></movie-list>
        </div>
      </Scroll>
      <!-- 加载更多组件 -->
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
import { ref, watch, nextTick } from 'vue'
import router from '../../router'
import { getMovie, getComingSoon } from '../../api/movie-show.js'
import { createMovieList } from '../../common/js/movieList.js'
// 标签数据
const switches = ref([
  {
    name: '正在热映',
  },
  {
    name: '即将上映',
  }
])
const fixedTitle = ref('')

// 加载状态
const hasMoreHotMovies = ref(true)
const hasMoreComingMovies = ref(true)
const loading = ref(false)
const error = ref('')
const comingMovies = ref([])
const hotMovies = ref([])
const currentIndex = ref(0)
const listProbeType = ref(3)
const listenScroll = ref(true)
const fullScreen = ref(true)
const scrollComponent = ref(null)
const pullup = ref(true)
const loadingFlag = ref(false)
const scorllY = ref(-1)
const hotMoviesIndex = ref(0)
const scrollIndex = ref(0)
const scrollY = ref('')
const fixedTop = ref(0)
const refs = ref({})
const needDate = ref(true)
const SEARCH_MORE = 10; // 每次请求数据的长度
const TITLE_HEIGHT = 30; // 日期栏高度

// 处理图片加载错误
const handleError = (e) => {
  // console.log('图片加载失败，使用占位图:', e.target.src)
  // 使用占位图替换加载失败的图片
  e.target.src = 'https://via.placeholder.com/80x120?text=电影海报'
}

const retryLoad = () => {
  error.value = ''
  loadMoviesByTab(currentIndex.value)
}
// const needDate=ref(true)

// 切换标签
const switchItem = (index) => {
  currentIndex.value = index
  // 切换标签时加载对应数据
  loadMoviesByTab(index)
  // 初始化滚动组件
  if (scrollComponent.value) {
    scrollComponent.value.refresh()
  }
  //scroll组件计算高度 保持正确的滚动
  if (scrollComponent.value) {
    setTimeout(() => {
      scrollComponent.value.refresh()
    }, 20)
  }
}
// 加载更多数据
const loadMoreData = () => {
  // 上次还没加载完的时候 忽略此次事件
  if (loading.value) {
    return
  }
  loading.value = true; // 加载中，设置标志为true
  if (currentIndex.value === 0) {
    if (!hasMoreHotMovies.value) {
      loading.value = false
      if (scrollComponent.value && scrollComponent.value.scroll) {
        scrollComponent.value.scroll.finishPullUp();
      }
      return
    }
    hotMoviesIndex.value += SEARCH_MORE
    getMovie(hotMoviesIndex.value, SEARCH_MORE).then(res => {
      hotMovies.value = hotMovies.value.concat(res.subjects || [])
      _checkMovie(res)
      loading.value = false
      // 完成上拉加载
      if (scrollComponent.value && scrollComponent.value.scroll) {
        scrollComponent.value.scroll.finishPullUp();
      }
    }).catch(err => {
      console.error('加载更多电影失败:', err)
      loading.value = false
      if (scrollComponent.value && scrollComponent.value.scroll) {
        scrollComponent.value.scroll.finishPullUp();
      }
    })
  } else {
    if (!hasMoreComingMovies.value) {
      loading.value = false
      if (scrollComponent.value && scrollComponent.value.scroll) {
        scrollComponent.value.scroll.finishPullUp();
      }
      return
    }
    // 加载即将上映的电影
    let comingMoviesIndex = comingMovies.value.length
    getComingSoon(comingMoviesIndex, SEARCH_MORE).then(res => {
      comingMovies.value = comingMovies.value.concat(res.subjects || [])
      _checkMovie(res)
      loading.value = false
      // 完成上拉加载
      if (scrollComponent.value && scrollComponent.value.scroll) {
        scrollComponent.value.scroll.finishPullUp();
      }
    }).catch(err => {
      console.error('加载更多即将上映电影失败:', err)
      loading.value = false
      if (scrollComponent.value && scrollComponent.value.scroll) {
        scrollComponent.value.scroll.finishPullUp();
      }
    })
  }
}

// 滚动事件
const scroll = (e) => {
  scorllY.value = e.detail.y
}

// 搜索功能
const goSearch = () => {
  router.push('/search')
}

// 选择电影
const selectMovie = (movie) => {
  router.push({ name: 'movieDetail', params: { id: movie.id } })
}
// 保存滚动组件的实例
const scorllMap = ref(null)
const listHeight = ref(0)
const getHeight = (height) => {
  listHeight.value = height
}
// 保存子组件传入的日期
const getMap = (map) => {
  scorllMap.value = map
}

//获取正在上映的电影
const _getMovie = () => {
  // console.log('开始加载正在热映的电影...')
  // console.log('MSW应该拦截此请求并返回模拟数据')
  getMovie(hotMoviesIndex.value, SEARCH_MORE).then(res => {
    // console.log('获取正在热映的电影成功:', res)
    // console.log('这是来自MSW的模拟数据:', res.subjects && res.subjects.length > 0)
    hotMovies.value = res.subjects || []
    // console.log('设置hotMovies数据:', hotMovies.value)
    _checkMovie(res)
    loading.value = false
    loadingFlag.value = true
  }).catch(err => {
    // console.error('加载正在热映电影失败:', err)
    // 在请求失败时使用模拟数据
    setTimeout(() => {
      // console.log('请求失败，使用备用模拟数据')
      hotMovies.value = generateMockMovies('hot')
      _checkMovie({ subjects: hotMovies.value, total: hotMovies.value.length, start: 0, count: hotMovies.value.length })
      error.value = ''
      loading.value = false
      loadingFlag.value = true
    }, 1000)
  })
}

//获取即将上映的电影
const _getComingSoon = () => {
  // console.log('开始加载即将上映的电影...')
  getComingSoon().then(res => {
    // console.log('获取即将上映的电影成功:', res)
    comingMovies.value = res.subjects || []
    // console.log('设置comingMovies数据:', comingMovies.value)
    _checkMovie(res)
    loading.value = false
    loadingFlag.value = true
  }).catch(err => {
    // console.error('加载即将上映电影失败:', err)
    // 在请求失败时使用模拟数据
    setTimeout(() => {
      // console.log('请求失败，使用备用模拟数据')
      comingMovies.value = generateMockMovies('coming')
      _checkMovie({ subjects: comingMovies.value, total: comingMovies.value.length, start: 0, count: comingMovies.value.length })
      error.value = ''
      loading.value = false
      loadingFlag.value = true
    }, 1000)
  })
}
const _checkMovie = (res) => {
  // 添加安全检查，确保res存在并且有必要的属性
  const movies = res ? res.subjects || [] : []
  if (!res || movies.length === 0 || (res.start !== undefined && res.count !== undefined && res.total !== undefined && (res.start + res.count) >= res.total)) {
    if (currentIndex.value === 0) {
      hasMoreHotMovies.value = false
    } else {
      hasMoreComingMovies.value = false
    }
    // 不要在这里设置loadingFlag.value = true，这应该在数据加载完成或出错时设置
  }
}
// 监听滚动事件
watch(scorllY, (newY, oldY) => {
  if (!newY) {// 如果在快速滚动时切换tab栏，滚动位置会读取错误，这里保留出错前正确的滚动位置
    scrollY.value = ''
  }
  if (!listHeight.value || !scorllMap) {
    return
  }
  if (newY > 0) {
    scrollIndex.value = 0
    return
  }
  //在中间部分滚动
  if (Array.isArray(listHeight.value) && listHeight.value.length > 1) {
    for (let i = 0; i < listHeight.value.length - 1; i++) {
      let height1 = listHeight.value[i]
      let height2 = listHeight.value[i + 1]
      if (-newY >= height1 && -newY < height2) {
        scrollIndex.value = i
        return
      }
    }
    //滚动到底部 且newY大于最后一个元素的上限
    scrollIndex.value = listHeight.value.length - 2
  }
})

const diff = (newval) => {
  let tempFixedTop = (newval > 0 && newval < TITLE_HEIGHT) ? newval - TITLE_HEIGHT : 0
  if (fixedTop.value === tempFixedTop) {
    return
  }
  fixedTop.value = tempFixedTop
  nextTick(() => {
    if (refs.value.fixed) {
      refs.value.fixed.style.transform = `translate3d(0, ${tempFixedTop}px, 0)`;
    }
  })
}
// 加载电影数据
const loadMoviesByTab = (tabIndex) => {
  // 设置加载状态
  loading.value = true
  loadingFlag.value = false

  if (tabIndex === 0) {
    // 加载正在热映的电影
    _getMovie()
  } else if (tabIndex === 1) {
    // 加载即将上映的电影
    _getComingSoon()
  }
}

// 组件初始化时加载数据
loadMoviesByTab(currentIndex.value)


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
