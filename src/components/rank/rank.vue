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

        <!-- 滚动列表 -->
        <Scroll class="rank-list" :data="rankList" ref="scrollRef">
            <div class="scroll-wrapper">
                <div class="scroll-content">
                    <h1 class="title">精选榜单</h1>

                    <!-- 动态渲染榜单 -->
                    <div class="rank-item" v-for="item in rankList" :key="item.id" @click="goTo(item.path)"
                        :class="item.type">
                        <div class="desc">
                            <h2 class="name">{{ item.title }}</h2>
                            <span>{{ item.subtitle }}</span>
                        </div>
                        <div class="rank-img">
                            <img :src="replaceUrl(item.poster)" :alt="item.title">
                        </div>
                    </div>
                </div>
            </div>
        </Scroll>

        <!-- 加载组件 -->
        <load-more v-if="!hasLoad" :fullScreen="false" />
        <router-view></router-view>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadMore from '../../base/loadmore/loadmore.vue'
import Scroll from '../../base/scroll/scroll.vue'
import WeekDate from '../../common/js/date'


// 响应式数据
const router = useRouter()
const hasLoad = ref(false)

// 榜单数据 - 简化结构
const rankList = ref([
    {
        id: 'top250',
        type: 'top250',
        title: '豆瓣 Top250',
        subtitle: '8分以上的好电影',
        path: '/rank/top250',
        poster: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg'
    },
    {
        id: 'weekly',
        type: 'weekly',
        title: '本周口碑榜',
        subtitle: '', // 会在onMounted中更新
        path: '/rank/weekly',
        poster: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2867890123.jpg'
    },
    {
        id: 'new-movie',
        type: 'new-movie',
        title: '新片榜',
        subtitle: '', // 会在onMounted中更新
        path: '/rank/new',
        poster: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2856789342.jpg'
    },
    {
        id: 'us-box',
        type: 'us-box',
        title: '北美票房榜',
        subtitle: '票房最高排名',
        path: '/rank/us',
        poster: 'https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2548771326.jpg'
    }
])

// 方法
const goSearch = () => router.push('/search')
const goTo = (path) => router.push(path)

// 图片防盗链处理
const replaceUrl = (srcUrl) => {
    if (!srcUrl) return ''
    return 'https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, '')
}
// 获取本周日期
const getWeekDate = () => {
    const date = new WeekDate()
    return `${date.getWeekStartDate()}-${date.getWeekEndDate()}`
}
// 组件挂载时执行
onMounted(async () => {
    // 同步操作 - 不需要 await
    rankList.value[1].subtitle = getWeekDate()
    rankList.value[2].subtitle = getWeekDate()

    //异步处理
    try {
        const movieData = await fetch('/api/weekly-movies')
        rankList.value[1].movies = movieData
    } catch (error) {
        console.error('获取电影数据失败:', error)
    }
    // 这个赋值必须等上面的异步操作完成后再执行
    hasLoad.value = true
})
</script>

<style scoped>
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
    /* 替换 $color-background-d */
    font-size: 16px;
    /* 替换 $font-size-medium-x */
    line-height: 35px;
    border-radius: 5px;
}

.rank .go-search .search-content span {
    display: inline-block;
    vertical-align: middle;
}

.rank .rank-list {
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 62px;
    padding: 0 15px;
    overflow: hidden;
}

.rank .rank-list .title {
    color: #333;
}

.rank .rank-list .scroll-content {
    padding: 20px 0;
}

.rank .rank-list .rank-item {
    margin-top: 15px;
    height: 150px;
    border-radius: 10px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-sizing: border-box;
}

.rank .rank-list .rank-item .desc {
    width: 40%;
    text-align: center;
}

.rank .rank-list .rank-item .desc .name {
    font-size: 18px;
    margin-bottom: 8px;
}

.rank .rank-list .rank-item .desc .brief {
    font-size: 14px;
}

.rank .rank-list .rank-item .rank-img {
    width: 55%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.rank .rank-list .rank-item .rank-img img {
    width: 60%;
    height: auto;
    max-height: 100px;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
    background-color: rgba(255, 255, 255, 0.2);
    padding: 5px;
}

.rank .top250 {
    background: linear-gradient(#E1A708, #EFD491);
}

.rank .weekly {
    background: linear-gradient(#32C05E, #A1E5BE);
}

.rank .new-movie {
    background: linear-gradient(#A361C3, #D9B9E8);
}

.rank .us-box {
    background: linear-gradient(#DD7286, #F3B9C5);
}
</style>
