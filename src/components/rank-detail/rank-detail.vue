<template>
  <div class="rank-detail">
    <!-- 页面标题 + 返回按钮 -->
    <div class="header-bar">
      <el-button type="text" @click="goBackToCards" class="back-btn">
        <el-icon><ArrowLeft /></el-icon> Back
      </el-button>
      <h1 class="title">{{ rankTitle }}</h1>
    </div>

    <!-- 分页导航 -->
    <div class="pagination-nav" v-if="showPagination">
      <el-button
        v-for="(item, index) in paginationItems"
        :key="index"
        :type="currentPage === item.page ? 'primary' : 'default'"
        @click="changePage(item.page)"
        size="small"
      >
        {{ item.label }}
      </el-button>
    </div>

    <!-- 电影列表 -->
    <div class="movie-list">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="movie-item"
        @click="goToMovie(movie.id)"
      >
        <div class="movie-poster">
          <el-image
            :src="replaceUrl(movie.images)"
            :width="70"
            :height="100"
            fit="cover"
            lazy
          >
            <template #error>
              <div class="image-slot">
                <el-icon><Film /></el-icon>
              </div>
            </template>
          </el-image>
        </div>
        <div class="movie-info">
          <h3 class="title">{{ movie.title }}</h3>
          <!-- 安全访问 rating.average -->
          <el-rate
            :model-value="(movie.rating?.average || 0) / 2"
            :disabled="true"
            :show-score="true"
            :max="5"
            :score-template="`${movie.rating?.average || 0}`"
            size="small"
          />
          <div class="director">
            导演：{{ movie.directors?.[0]?.name || '未知' }}
          </div>
          <div class="actor">主演：{{ formatActors(movie.casts) }}</div>
        </div>
      </div>
    </div>

    <!-- 加载中 -->
    <el-skeleton v-if="loading" :rows="5" animated class="loading-skeleton" />

    <!-- 空状态 -->
    <el-empty v-else-if="!movies.length" description="暂无数据" class="empty-state">
      <el-button type="primary" @click="refresh">刷新</el-button>
    </el-empty>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRankStore } from '@/store/modules/rank'
import { ArrowLeft, Film } from '@element-plus/icons-vue'
// 导入您的 API 文件
import * as movieRankAPI from '@/api/movie-rank'

// 定义分页项的类型
interface PaginationItem {
  label: string;
  page: number;
}

const route = useRoute()
const router = useRouter()
const rankStore = useRankStore()

const loading = ref(false)
const movies = ref<any[]>([])
const rankTitle = ref('')
const currentPage = ref(1)
const showPagination = ref(false)
const paginationItems = ref<PaginationItem[]>([]) // 明确指定类型

// 根据路径确定榜单类型和对应的 API 函数
const apiMap = {
  top250: movieRankAPI.top250Rank,
  weekly: movieRankAPI.weeklyRank,
  new: movieRankAPI.newMoviesRank,
  us: movieRankAPI.usRank,
}

// 根据路径确定榜单类型
onMounted(() => {
  const path = route.path
  if (path.includes('top250')) {
    rankTitle.value = '豆瓣 Top250'
    showPagination.value = true
    paginationItems.value = [
      { label: '1-50', page: 1 },
      { label: '51-100', page: 2 },
      { label: '101-150', page: 3 },
      { label: '151-200', page: 4 },
      { label: '201-250', page: 5 }
    ]
  } else if (path.includes('weekly')) {
    rankTitle.value = '本周口碑榜'
  } else if (path.includes('new')) {
    rankTitle.value = '新片榜'
  } else if (path.includes('us')) {
    rankTitle.value = '北美票房榜'
  }

  loadData()
})

// 加载数据
const loadData = async () => {
  loading.value = true
  const path = route.path
  const type = path.split('/').pop()

  try {
    const apiFunction = type ? apiMap[type as keyof typeof apiMap] : undefined
    if (apiFunction) {
      // 调用 API
      const start = showPagination ? (currentPage.value - 1) * 50 : 0
      const count = showPagination ? 50 : undefined
      const data = await apiFunction(start, count)
      movies.value = data.subjects // 注意：模拟数据结构是 { subjects: [...] }
    } else {
      console.error(`Unknown rank type: ${type}`)
      movies.value = []
    }
  } catch (error) {
    console.error('加载排行榜数据失败:', error)
    movies.value = []
  } finally {
    loading.value = false
  }
}

// 切换页面
const changePage = (page: number) => {
  currentPage.value = page
  loadData()
}

// 格式化主演信息
const formatActors = (casts: any[]): string => {
  if (!casts || !Array.isArray(casts) || casts.length === 0) {
    return '未知'
  }
  return casts.slice(0, 2).map(actor => actor.name).join(' / ')
}

// 图片URL处理（防盗链）- 修复空格问题
const replaceUrl = (srcUrlObj: any): string => {
  if (!srcUrlObj || typeof srcUrlObj !== 'object' || !srcUrlObj.large) {
    return ''
  }
  const originalUrl = srcUrlObj.large.replace(/^https?:\/\//, '').trim()
  return `https://images.weserv.nl/?url=${originalUrl}`
}

// 跳转到电影详情
const goToMovie = (id: string) => {
  if (!id) {
    console.error('电影ID为空，无法跳转')
    return
  }
  router.push(`/movie-detail/${id}`)
}

// 刷新数据
const refresh = () => {
    loadData()
}

// 返回到卡片视图 - 更新 Vuex 状态
const goBackToCards = () => {
  rankStore.updateShowCards(true)
}
</script>

<style scoped>
/* 保持原有样式不变 */
.rank-detail {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header-bar {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
  background-color: #fff;
  border-radius: 4px;
}

.back-btn {
  margin-right: 10px;
  font-size: 14px;
}

.title {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.pagination-nav {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.movie-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.movie-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.movie-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.movie-poster {
  flex: 0 0 70px;
  margin-right: 15px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.movie-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
}

.movie-info .title {
  font-size: 16px;
  color: #333;
  margin: 0;
  font-weight: 500;
  line-height: 1.4;
}

.movie-info .director {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.movie-info .actor {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-skeleton {
    margin-top: 20px;
    padding: 20px;
    border-radius: 8px;
    background-color: #fff;
}

.empty-state {
    margin-top: 50px;
    padding: 50px 0;
}

/* 调整评分组件样式 */
:deep(.el-rate__text) {
  color: #ff4d4d !important;
  font-size: 12px;
}

:deep(.el-rate__icon--full) {
  color: #ff4d4d !important;
}
</style>