<template>
  <div class="movie-list">
    <!-- 空状态处理 -->
    <el-empty v-if="!movies.length" description="暂无数据" class="empty-state">
      <el-icon class="empty-icon"><Film /></el-icon>
    </el-empty>
    
    <ul v-else>
      <li v-for="(movie, index) in movies" @click="selectItem(movie)" ref="group">
        <div class="date" v-if="needDate && !dateEqual(index)">{{ movie.date }}</div>
        <div class="item">
          <div class="info-img">
            <el-image 
              :src="replaceUrl(movie.images?.small)" 
              class="poster" 
              :height="120" 
              :width="80"
              fit="cover"
              @error="handleImageError"
              lazy
            >
              <template #error>
                <img src="https://picsum.photos/80/120" />
              </template>
            </el-image>
          </div>
          <div class="info-desc">
            <div class="title-section">
              <p class="title">{{ movie.title }}</p>
              <div v-if="movie.rating?.average" class="rating-section">
                <el-rate 
                  v-model="movie.rating.average" 
                  :max="10" 
                  :show-score="showScore"
                  disabled
                  class="star-rating"
                />
              </div>
            </div>
            <div class="director">导演：{{ movie.directors ? movie.directors[0]?.name : '未知' }}</div>
            <div class="casts">主演：{{ movie.casts ? movie.casts.map(item => item.name).join('/') : '未知' }}</div>
            <div class="seen-count">{{ movie.collect_count ? movie.collect_count : '1000200' }}人看过</div>
          </div>
        </div>  
      </li>
    </ul>
    
    <!-- 加载更多 -->
    <div v-if="movies.length" class="load-more">
      <el-button 
        v-if="hasMore" 
        loading 
        plain
        size="small"
        :disabled="true"
      >
        加载中...
      </el-button>
      <span v-else class="no-more">没有更多数据了</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElRate, ElImage, ElEmpty, ElButton, ElIcon } from 'element-plus'
import { Film } from '@element-plus/icons-vue'

const props = defineProps({
  movies: {
    type: Array,
    default: function() {
      return []
    }
  },
  hasMore: {
    type: Boolean,
    default: true
  },
  needDate: {
    type: Boolean,
    default: true
  },
  showScore: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['getHeight', 'getMap'])

const listHeight = ref([])
const group = ref([])

function dateEqual(index) {
  if (index === 0) {
    return false
  }
  var currentDate = props.movies[index].mainland_pubdate || props.movies[index].date
  var prevDate = props.movies[index - 1].mainland_pubdate || props.movies[index - 1].date
  return currentDate === prevDate
}

function recalculateHeight() {
  setTimeout(function() {
    _calculateHeight()
    getMap()
  }, 20)
}
// console.log(props.movies)
function getMap() {
  var map = {}
  for (var i = 0; i < props.movies.length; i++) {
    var dateKey = props.movies[i].mainland_pubdate || props.movies[i].date || '未知日期'
    if (map[dateKey]) {
      map[dateKey].push(props.movies[i])
    } else {
      map[dateKey] = [props.movies[i]]
    }
  }
  emit('getMap', map)
}

function _calculateHeight() {
  listHeight.value = []
  var height = 0
  group.value.forEach(function(item) {
    if (item) {
      height += item.clientHeight
      listHeight.value.push(height)
    }
  })
  emit('getHeight', listHeight.value)
}

function selectItem(movie) {
  // console.log('Selected movie:', movie)
}

//图片防盗链
const replaceUrl = (srcUrl) => {
  if (srcUrl !== undefined) {
    return 'https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, '')
  }
  return ''
}

//处理图片加载错误
const handleImageError = (e) => {
  // console.log('图片加载失败，使用占位图:', e.target.src)
  // 使用占位图替换加载失败的图片
  e.target.src = 'https://picsum.photos/80/120'
}

watch(function() {
  return props.movies
}, function() {
  if (props.needDate) {
    setTimeout(function() {
      getMap()
      _calculateHeight()
    })
  }
})
</script>

<style scoped>
.movie-list {
  margin-top: 16px;
  width: 100%;
  background-color: #fff;
}

.movie-list ul {
  width: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
}

.movie-list ul li {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.movie-list ul li:last-child {
  border-bottom: none;
}

.movie-list ul .date {
  width: 100%;
  background-color: #f5f5f5;
  padding-left: 5px;
  height: 30px;
  line-height: 30px;
  margin-bottom: 10px;
}

.movie-list ul .item {
  display: flex;
  align-items: flex-start;
  box-sizing: border-box;
}

.movie-list ul .item .info-img {
  flex: 0 0 80px;
  margin-right: 12px;
  overflow: hidden;
}

.movie-list ul .item .info-img img {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
}

.movie-list ul .item .info-desc {
  height: 120px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.movie-list ul .item .info-desc .title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  width: 100%;
}

.movie-list ul .item .info-desc .title {
  font-size: 16px;
  color: #333;
  line-height: 1.2;
  font-weight: 500;
  margin: 0;
  flex: 1;
}

.movie-list ul .item .info-desc .rating-section {
  display: flex;
  align-items: center;
  margin-left: 8px;
  white-space: nowrap;
}

.movie-list ul .item .info-desc .director {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
  line-height: 1.2;
}

.movie-list ul .item .info-desc .casts {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
  line-height: 1.2;
}

.movie-list ul .item .info-desc .seen-count {
  font-size: 14px;
  color: #999;
  line-height: 1.2;
  margin-top: 4px;
}
</style>
