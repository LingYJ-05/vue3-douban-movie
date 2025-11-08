<template>
    <div class="rank">
        <!-- 搜索栏 -->
        <div class="go-search" @click="goSearch">
            <div class="logo">
                <img src="../movie-show/douban-logo.png" width="35" height="35">
            </div>
            <div class="search-content">
                <span>电影/影人/标签</span>
            </div>
        </div>

        <!-- 控制按钮：隐藏/显示卡片 -->
        <div class="control-section">
            <el-button type="primary" size="default" @click="toggleCards" class="toggle-btn">
                <el-icon>
                    <component :is="showCards ? View : Hide" />
                </el-icon>
                {{ showCards ? '隐藏卡片' : '显示卡片' }}
            </el-button>
        </div>

        <!-- 四个榜单卡片（根据 Pinia 状态 showCards 控制显示/隐藏） -->
        <div v-if="showCards" class="rank-cards">
            <div v-for="item in rankCards" :key="item.id" class="rank-card" @click="goTo(item.path)">
                <div class="card-header">
                    <h2 class="title">{{ item.title }}</h2>
                    <p class="subtitle">{{ item.subtitle }}</p>
                </div>
                <div class="card-image">
                    <el-image :src="replaceUrl(item.poster)" :alt="item.title" fit="cover" lazy>
                        <template #error>
                            <div class="image-slot">
                                <el-icon>
                                    <Film />
                                </el-icon>
                            </div>
                        </template>
                    </el-image>
                </div>
            </div>
        </div>

        <!-- 加载组件 -->
        <load-more v-if="!hasLoad && showCards" :fullScreen="false" />

        <!-- router-view 用于显示子路由内容 (当卡片隐藏时显示) -->
        <router-view v-if="!showCards"></router-view>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRankStore } from '@/store/modules/rank.ts'
import LoadMore from '../../base/loadmore/loadmore.vue'
import { Film, Hide, View } from '@element-plus/icons-vue'

const router = useRouter()
const rankStore = useRankStore()

const hasLoad = ref(false)

// 从 Vuex 获取 showCards 状态
const showCards = computed(() => rankStore.getShowCards)

// 榜单卡片数据
const rankCards = ref([
    {
        id: 'top250',
        title: '豆瓣 Top250',
        subtitle: '8分以上的好电影',
        path: '/rank/top250',
        poster: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg'
    },
    {
        id: 'weekly',
        title: '本周口碑榜',
        subtitle: '最新高分电影',
        path: '/rank/weekly',
        poster: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2867890123.jpg'
    },
    {
        id: 'new-movie',
        title: '新片榜',
        subtitle: '最新上映电影',
        path: '/rank/new',
        poster: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2856789342.jpg'
    },
    {
        id: 'us-box',
        title: '北美票房榜',
        subtitle: '票房最高排名',
        path: '/rank/us',
        poster: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2548771326.jpg'
    }
])

// 控制卡片显示/隐藏 - 更新 Vuex 状态
const toggleCards = () => {
    rankStore.updateShowCards(!showCards.value)
}

// 方法
const goSearch = () => router.push('/search')
const goTo = (path: string) => {
    router.push(path)
    // 点击卡片后，隐藏卡片视图，显示详情视图
    rankStore.updateShowCards(false)
}

// 图片防盗链处理 - 修复空格问题
const replaceUrl = (srcUrl: string): string => {
    if (!srcUrl) return ''
    const originalUrl = srcUrl.replace(/^https?:\/\//, '').trim();
    return `https://images.weserv.nl/?url=${originalUrl}`;
}

// 组件挂载时执行
onMounted(async () => {
    try {
        // 这里可以添加异步数据加载逻辑
    } catch (error) {
        console.error('获取电影数据失败:', error)
    } finally {
        hasLoad.value = true
    }
})
</script>

<style scoped>
/* 保持原有样式不变 */
.rank .go-search {
    height: 50px;
    box-sizing: border-box;
    padding: 10px 10px 5px 60px;
    text-align: center;
}

.rank .go-search .logo {
    position: absolute;
    left: 10px;
}

.rank .go-search .search-content {
    background-color: #f0f0f0;
    font-size: 16px;
    line-height: 35px;
    border-radius: 5px;
}

.rank .go-search .search-content span {
    display: inline-block;
    vertical-align: middle;
}

/* 控制按钮样式 */
.control-section {
    padding: 10px 15px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

.toggle-btn {
    width: 100%;
}

.rank .rank-cards {
    padding: 15px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 15px;
}

.rank .rank-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rank .rank-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rank .rank-card .card-header {
    padding: 15px;
    background: linear-gradient(135deg, #42bd56, #6bff84);
    color: #fff;
    text-align: center;
}

.rank .rank-card .title {
    font-size: 18px;
    margin: 0 0 5px 0;
    font-weight: 500;
}

.rank .rank-card .subtitle {
    font-size: 14px;
    opacity: 0.8;
}

.rank .rank-card .card-image {
    height: 150px;
    overflow: hidden;
}

.rank .rank-card .card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0;
}

/* 调整图片占位符样式 */
.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    color: #999;
}
</style>