<template>
  <div class="user-center">
    <!-- 用户信息 -->
    <el-card class="user-info-card" shadow="never">
      <div class="user">
        <el-image 
          src="./avatar.jpg" 
          alt="用户头像" 
          class="avatar"
          fit="cover"
          lazy
        >
          <template #error>
            <div class="image-slot">
              <el-icon><User /></el-icon>
            </div>
          </template>
        </el-image>
        <div class="name">用户名</div>
      </div>
    </el-card>

    <!-- 标签切换 -->
    <div class="switch-item">
      <el-tabs 
        v-model="activeTab" 
        type="card" 
        @tab-change="handleTabChange"
        class="user-tabs"
      >
        <el-tab-pane 
          v-for="(item, index) in tabs" 
          :key="index" 
          :label="`${item.name} (${item.count})`"
          :name="index.toString()"
        >
          <!-- 标签内容区域 -->
          <div class="tab-content">
            <!-- 显示数量 -->
            <div class="content-header">
              <span class="movie-num">共 {{ itemLength }} 项</span>
            </div>

            <!-- 内容列表 -->
            <div v-if="itemLength > 0">
              <!-- 电影列表 -->
              <div v-if="currentIndex !== 2" class="movie-list">
                <div 
                  v-for="movie in itemLists" 
                  :key="movie.id" 
                  class="movie-item"
                  @click="selectMovie(movie)"
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
                    <el-rate 
                      :model-value="movie.rating.average / 2" 
                      :disabled="true"
                      :show-score="true"
                      :max="5"
                      size="small"
                    />
                    <div class="director">
                      导演：{{ movie.directors && movie.directors[0] ? movie.directors[0].name : '未知' }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 影人列表 -->
              <div v-else class="celebrity-list">
                <div 
                  v-for="celebrity in itemLists" 
                  :key="celebrity.id" 
                  class="celebrity-item"
                  @click="selectCelebrity(celebrity.id)"
                >
                  <div class="celebrity-avatar">
                    <el-image 
                      :src="replaceUrl(celebrity.avatars)" 
                      :width="60" 
                      :height="60"
                      fit="cover"
                      lazy
                    >
                      <template #error>
                        <div class="image-slot">
                          <el-icon><User /></el-icon>
                        </div>
                      </template>
                    </el-image>
                  </div>
                  <div class="celebrity-info">
                    <h3 class="name">{{ celebrity.name }}</h3>
                    <p class="profession">{{ celebrity.professions?.join(' / ') || '未知职业' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态提示 -->
            <el-empty 
              v-else 
              description="暂无内容，敬请期待"
              class="empty-state"
            >
              <el-icon class="empty-icon"><Film /></el-icon>
            </el-empty>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElTabs, ElTabPane, ElCard, ElImage, ElEmpty, ElIcon, ElRate } from 'element-plus'
import { User, Film } from '@element-plus/icons-vue'

// 响应式数据
const router = useRouter()
const currentIndex = ref(0)
const activeTab = ref('0') // Element Plus Tabs需要字符串类型

// 死数据模拟
const mockData = {
  wantedMovies: [
    {
      id: '1',
      title: '肖申克的救赎',
      rating: { average: 9.7 },
      directors: [{ name: '弗兰克·德拉邦特' }],
      images: { large: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg' }
    },
    {
      id: '2',
      title: '霸王别姬',
      rating: { average: 9.6 },
      directors: [{ name: '陈凯歌' }],
      images: { large: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2561706776.jpg' }
    }
  ],
  watchedMovies: [
    {
      id: '3',
      title: '阿甘正传',
      rating: { average: 9.5 },
      directors: [{ name: '罗伯特·泽米吉斯' }],
      images: { large: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2372307693.jpg' }
    },
    {
      id: '4',
      title: '泰坦尼克号',
      rating: { average: 9.4 },
      directors: [{ name: '詹姆斯·卡梅隆' }],
      images: { large: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2372307693.jpg' }
    }
  ],
  collectedCelebrities: [
    {
      id: '1',
      name: '莱昂纳多·迪卡普里奥',
      professions: ['演员', '制片人'],
      avatars: { large: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2561706776.jpg' }
    },
    {
      id: '2',
      name: '汤姆·汉克斯',
      professions: ['演员', '导演'],
      avatars: { large: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2561706776.jpg' }
    }
  ]
}

// 标签配置
const tabs = ref([
  { name: '想看', count: 0 },
  { name: '看过', count: 0 },
  { name: '影人', count: 0 }
])

// 列表数据
const itemLists = ref([])
const itemLength = ref(0)

// 根据当前索引获取对应数据
const getCurrentList = (index) => {
  switch (index) {
    case 0: return mockData.wantedMovies
    case 1: return mockData.watchedMovies
    case 2: return mockData.collectedCelebrities
    default: return []
  }
}

// 切换标签
const handleTabChange = (newTab) => {
  const index = parseInt(newTab)
  currentIndex.value = index
  updateListData()
}

// 更新列表数据
const updateListData = () => {
  const currentList = getCurrentList(currentIndex.value)
  itemLists.value = currentList || []
  itemLength.value = itemLists.value.length
  
  // 更新标签计数
  tabs.value[0].count = mockData.wantedMovies.length
  tabs.value[1].count = mockData.watchedMovies.length
  tabs.value[2].count = mockData.collectedCelebrities.length
}

// 选择电影
const selectMovie = (movie) => {
  console.log('选择电影:', movie)
  // router.push(`/movie-detail/${movie.id}`)
}

// 选择影人
const selectCelebrity = (id) => {
  console.log('选择影人:', id)
  // router.push(`/celebrity/${id}`)
}

// 图片URL处理（防盗链）
const replaceUrl = (srcUrlObj) => {
  if (!srcUrlObj || typeof srcUrlObj !== 'object' || !srcUrlObj.large) {
    return '';
  }
  const originalUrl = srcUrlObj.large.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${originalUrl}`;
}

// 组件挂载时初始化
onMounted(() => {
  updateListData()
})
</script>

<style scoped>
.user-center {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 61px;
  background-color: #f8f8f8;
  overflow: hidden;
}

.user-center .user-info-card {
  border: none;
  background: linear-gradient(135deg, #42bd56, #6bff84);
  margin-bottom: 0;
  padding: 20px 0;
}

.user-center .user {
  box-sizing: border-box;
  width: 100%;
  padding: 15px 20px;
  display: flex;
  align-items: center;
}

.user-center .user .avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.user-center .user .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.user-center .user .name {
  color: #f5f5f5;
  font-size: 20px;
  font-weight: 500;
}

.user-center .switch-item {
  position: absolute;
  top: 150px;
  width: 100%;
  bottom: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.user-center .user-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.user-center .user-tabs .el-tabs__content {
  flex: 1;
  overflow: auto;
  padding: 0;
}

.user-center .tab-content {
  height: 100%;
  padding: 0;
}

.user-center .content-header {
  padding: 10px 20px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.user-center .movie-num {
  color: #606266;
  font-size: 14px;
}

.user-center .empty-state {
  padding: 100px 0;
}

.user-center .empty-icon {
  font-size: 48px;
  color: #c0c4cc;
}

/* 调整Tabs样式 */
.user-center :deep(.el-tabs__header) {
  background-color: #fff;
  margin: 0;
}

.user-center :deep(.el-tabs__nav) {
  width: 100%;
}

.user-center :deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
  font-size: 14px;
}

.user-center :deep(.el-tabs__active-bar) {
  background-color: #42bd56;
}

.user-center :deep(.el-tabs__item.is-active) {
  color: #42bd56;
}

/* 电影列表样式 */
.movie-list {
  padding: 10px 20px;
}

.movie-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.movie-item:hover {
  background-color: #f5f5f5;
}

.movie-poster {
  flex: 0 0 70px;
  margin-right: 10px;
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

/* 影人列表样式 */
.celebrity-list {
  padding: 10px 20px;
}

.celebrity-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.2s;
}

.celebrity-item:hover {
  background-color: #f5f5f5;
}

.celebrity-avatar {
  flex: 0 0 60px;
  margin-right: 10px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.celebrity-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
}

.celebrity-info .name {
  font-size: 16px;
  color: #333;
  margin: 0;
  font-weight: 500;
  line-height: 1.4;
}

.celebrity-info .profession {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}
</style>