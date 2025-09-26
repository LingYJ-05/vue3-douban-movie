<template>
    <div class="rank">
        <div class="go-search" @click="goSearch">
            <div class="logo">
                <img src="../movie-show/douban-logo.png" width="35" height="35">
            </div>
            <div class="search-content">
                <span>电影/影人/标签</span>
            </div>
        </div>

        <Scroll class="rank-list" :data="urlList" ref="scrollRef">
            <div class="scroll-wrapper">
                <div class="scroll-content">
                    <h1 class="title">精选榜单</h1>

                    <div class="rank-item top250" @click="goTo('/rank/top250')">
                        <div class="desc">
                            <h2 class="name">豆瓣 Top250</h2>
                            <span>8分以上的好电影</span>
                        </div>
                        <div class="rank-img">
                            <img :src="replaceUrl('https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg')"
                                alt="Top250电影">
                        </div>
                    </div>
                    <div class="rank-item weekly" @click="goTo('/rank/weekly')">
                        <div class="desc">
                            <h2 class="name">本周口碑榜</h2>
                            <span class="brief">{{ weekDate }}</span>
                        </div>
                        <div class="rank-img">
                            <img :src="replaceUrl('https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2867890123.jpg')"
                                alt="本周口碑电影">
                        </div>
                    </div>
                    <div class="rank-item new-movie" @click="goTo('/rank/new')">
                        <div class="desc">
                            <h2 class="name">新片榜</h2>
                            <span class="brief">{{ weekDate }}</span>
                        </div>
                        <div class="rank-img">
                            <img :src="replaceUrl('https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2856789342.jpg')"
                                alt="新片榜电影">
                        </div>
                    </div>
                    <div class="rank-item us-box" @click="goTo('/rank/us')">
                        <div class="desc">
                            <h2 class="name">北美票房榜</h2>
                            <span class="brief">票房最高排名</span>
                        </div>
                        <div class="rank-img">
                            <img :src="replaceUrl('https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2548771326.jpg')"
                                alt="北美票房电影">
                        </div>
                    </div>
                </div>
            </div>
        </Scroll>
        <load-more v-if="!hasLoad" :fullScreen="fullScreen" />
        <router-view></router-view>
    </div>
</template>

<script setup name="Rank">

// 正确导入必要的内容
import LoadMore from '../../base/loadmore/loadmore.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Scroll from '../../base/scroll/scroll.vue'
import WeekDate from '../../common/js/date';
import { top250Rank, weeklyRank, newMoviesRank, usRank } from '../../api/movie-rank'


//响应式数据
const router = useRouter()
const weekDate = ref('')
const hasLoad = ref(false)
const urlList = ref([])
const scrollRef = ref(null)



//方法
// 添加搜索功能
const goSearch = () => {
    router.push('/search')
}
const fullScreen = ref(false)

const goTo = (path) => {
    router.push(path)
}
//图片防盗
const replaceUrl = (srcUrl) => {
    if (srcUrl) {
        return 'https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, '');
    }
    return ''
}
//
const getUrlList = (urls) => {
    const list = []
    urls.forEach((item, index) => {
        // 确保有subjects属性且是数组
        if (!item || !Array.isArray(item.subjects)) {
            list[index] = []
            return
        }

        const subjects = item.subjects.slice(0, 3) //取前3个
        list[index] = []

        subjects.forEach((movieItem) => {
            // 处理不同数据结构
            if (movieItem.subject) {
                // 处理嵌套subject结构
                if (movieItem.subject.images && movieItem.subject.images.medium) {
                    list[index].push(movieItem.subject.images.medium)
                }
            } else if (movieItem.images && movieItem.images.medium) {
                // 直接的images结构
                list[index].push(movieItem.images.medium)
            }
        })

        //确保至少有2个元素再交换位置
        if (list[index].length >= 2) {
            //将第二个图放在第一位
            [list[index][0], list[index][1]] = [list[index][1], list[index][0]]
        }
    })
    // 确保每个榜单数组至少有一个元素，避免白屏
    for (let i = 0; i < list.length; i++) {
        if (!list[i] || list[i].length === 0) {
            // 如果没有图片，使用一个默认占位图
            list[i] = ['https://img2.doubanio.com/view/photo/s_ratio_poster/public/p2588658240.jpg'];
        }
    }
    urlList.value = list
}
const _getWeekDate = () => {
    const data = new WeekDate()
    weekDate.value = `${data.getWeekStartDate()}-${data.getWeekEndDate()}`
}
const _getRankList = async () => {
    try {
        const [top250Res, weeklyRes, newMoviesRes, usRes] = await Promise.all([
            top250Rank(),
            weeklyRank(),
            newMoviesRank(),
            usRank()
        ])
        getUrlList([top250Res, weeklyRes, newMoviesRes, usRes])
        hasLoad.value = true
    } catch (error) {
        // console.log(error)
    }
}
onMounted(() => {
    _getRankList()
    _getWeekDate()
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
    /* 替换 $color-text-f */
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
