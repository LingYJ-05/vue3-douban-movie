<template>
    <div class="movie-info">
        <div class="overall">
            <div class="desc">
                <h2 class="title">{{ MovieDetail.title }}</h2>
                <span class="tag">{{ tags }}</span>
                <span class="original-title">{{ MovieDetail.original_title }}</span>
                <div class="pubdate">{{ pubdate }}</div>
                <div class="duration">{{ duration }}</div>
            </div>
            <div class="rank">
                <sapn class="origin">豆瓣评分</sapn>
                <span class="rating" v-if="rating"></span>
                <Star :score="MovieDetail.rating.average" :needNullStar="needNullStar" :size="24" />
                <span class="num" v-if="rating">{{ MovieDetail.rating.count }}</span>
            </div>
        </div>
        <div class="operate">
            <div class="want-watch" @click="saveWantedMovie" :class="{ 'wanted': iswanted(movieDetail.id) }"
                v-text="wantedText"></div>
            <div class="has-watched" @click="saveWantedMovie" :class="{ 'watched': hasWatched }">
                <img src="./avatar.jpg" v-show="hasWatched" width="25" height="25" alt="">
                {{ watchedText }}
            </div>
        </div>
        <div class="summary">
            <h2 class="title">剧情简介</h2>
            <p class="content">>&nbsp;&nbsp;&nbsp;&nbsp;{{ movieDetail.summary }}</p>
        </div>
        <Scroll :class="casts" :scrollX="scrollX" :eventPassthrough="eventPassthrought" ref="scroll">
            <div class="casts-content" ref="contentRef">
                <h2 class="title">影人</h2>
                <div class="cats-item" v-for="item in allCasts">
                    <img v-lazy="replaceUrl(item.avatars.large)" width="90" height="120" alt="">
                    <h3 class="item-title">{{ item.name }}</h3>
                    <span v-if="item.isDirector">导演</span>
                </div>
                <div class="no-result" v-if="!allCasts.length">
                    抱歉，暂无影人信息:(
                </div>
            </div>
        </Scroll>
    </div>
</template>


<script setup name="movieInfo">
import { computed, ref, onMounted } from 'vue'
import Scroll from '../../base/scroll/scroll.vue';
import Star from '../../base/star/star.vue';
import MovieDetail from '../movie-detail/movie-detail.vue';


// 定义props
const props = defineProps({
    MovieDetail: {
        type: Object,
        default: () => ({})
    }
})

//创建响应式数据
const scrollX = ref(true)
const eventPassthrought = ref('vertical')
const needNullStar = ref(true)
const watched = ref('看过 ☆☆☆☆☆')
const wantedText = ref('想看 ☆☆☆☆☆')
const hasWatched = ref(false)

// 创建ref引用
const contentRef = ref(null)
const scrollRef = ref(null)

// h获取vuex store
const store = useStore()

//计算属性 用于处理复杂的数学逻辑
// 评分是否显示(0分不显示)
const rating = computed(() => {
    let rating = pros.movieDetail.rating?.average || 0
    return rating !== 0
})

// 电影标签
const tags = computed(() => {
    let year = props.movieDetail.year
    let tag = props.movieDetail.genres?.join(' / ') || ''
    return `${year} ${tag}`
})
// 电影时长
const duration = computed(() => {
    return props.MovieDetail.duration?.[0] || ''
})
// 上映日期
const pubdate = computed(() => {
    let pubdate = ''
    let data = props.MovieDetail.pubdate || []

    for (let i = 0; i < data.length; i++) {
        if (data[i].indexOf('电影节') === -1) {
            pubdate = data[i]  //没有在中国大陆上映，取不为电影节的最后一个信息
        }
        if (data[i].indexOf('电影节') > -1) {
            pubdate = data[i]  //在中国大陆上映，取电影节信息
            break
        }
    }
    if (!pubdate) {
        pubdate = '暂无上映日期'
    }
    return pubdate
})
// 所有影人(导演加演员)
const allCasts = computed(() => {
    let directors = props.movieDetail.directors?.map(item => item.avatars !== null) || []
    return directors.concat(casts)
})
// 方法定义
const selectCelebrity = async (id) => {
    // console.log('选择影人', id)
}

//图片防盗锁
const replaceUrl = (srcUrl) => {
    if (srcUrl) {
        return 'https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, '');
    }
    return ''
}
//保存已看过的电影
const saveWatchedMovie = () => {
    store.dispatch('markWatchedMovie', props.movieDetail)

    const index = store.getters.watchedMovies.findIndex(item => item.id === props.movieDetail.id)
    if (index > -1) {
        hasWatched.value = true
        wantedText.value = '已看过'
    } else {
        hasWatched.value = false
        wantedText.value = '已看 ☆☆☆☆☆'
    }
}

//保存想看的电影
const saveWantedMovie = () => {
    store.dispatch('markWantedMovie', props.movieDetail)

    const index = store.getters.wantedMovies.findIndex(item => item.id === props.movieDetail.id)
    if (index > -1) {
        wantedText.value = '已想看'
    } else {
        wantedText.value = '想看'
    }
}

//检查是否已看
const iswanted = (id) => {
    const index = store.getters.wantedMovies.findIndex(item => item.id === id)
    if (index > -1) {
        wantedText.value = '已想看'
        return true
    }
    return false
}

//检查是否已观看
const isWatched = (id) => {
    const index = store.getters.watchedMovies.findIndex(item => item.id === id)
    if (index > -1) {
        hasWatched.value = true
        return true
    }
    return false
}

// 格式化评分补零
const _initPics = () => {
    let picWidth = 90
    let margin = 0
    let width = (picWidth + margin) * allCasts.value.length - margin
    if (contentRef.value) {
        contentRef.value.style.width = width + 'px'
    }
}
// 组件挂载后的逻辑
onMounted(async () => {
    await nextTick()
    _initPics()
})

//刷新滚动组件
if (scrollRef.value && scrollRef.value.refresh) {
    scrollRef.value.refresh()
}
</script>


<style scoped>
.movie-info {
    background-color: #f5f5f5;
    /* $color-background - 假设值 */
    padding: 0 20px;
}

.movie-info .overall {
    display: flex;
    height: 140px;
    justify-content: space-between;
}

.movie-info .overall .desc {
    flex: 0 0 70%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

.movie-info .overall .desc .title {
    font-size: 18px;
    color: #333;
    padding: 10px 0 5px 0;
}

.movie-info .overall .desc span {
    font-size: 12px;
}

.movie-info .overall .rank {
    height: 70px;
    margin-top: 15px;
    padding: 10px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 0px 5px #ccc;
    background-color: #f8f8f8;
}

.movie-info .overall .rank span {
    font-size: 12px;
    color: #666;
}

.movie-info .overall .rank span.rating {
    font-size: 18px;
    color: #333;
}

.movie-info .summary {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
}

.movie-info .summary .title {
    font-size: 12px;
}

.movie-info .summary .content {
    padding-top: 10px;
    font-size: 14px;
    color: #333;
    line-height: 25px;
}

.movie-info .operate {
    margin-top: 20px;
    line-height: 35px;
    height: 35px;
    display: flex;
    text-align: center;
    font-size: 14px;
    color: #ff4500;
}

.movie-info .operate .want-watch {
    flex: 1;
    border: 1px solid #ff4500;
    border-radius: 5px;
    margin-right: 20px;
}

.movie-info .operate .want-watch.wanted {
    border: 1px solid #ff6b6b;
    color: #ff6b6b;
}

.movie-info .operate .has-watched {
    flex: 2;
    border: 1px solid #ff4500;
    border-radius: 5px;
}

.movie-info .operate .has-watched.watched {
    border: 1px solid #ff6b6b;
    color: #ff6b6b;
}

.movie-info .operate .has-watched.watched img {
    display: inline-block;
    vertical-align: middle;
    padding-bottom: 2px;
    border-radius: 50%;
}

.movie-info .casts {
    padding: 30px 0;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    font-size: 0;
    border-bottom: 1px solid #e0e0e0;
}

.movie-info .casts .casts-content .title {
    font-size: 12px;
    padding-bottom: 20px;
}

.movie-info .casts .casts-content .cast-item {
    width: 90px;
    vertical-align: top;
    display: inline-block;
    text-align: center;
    margin-right: 8px;
    font-size: 12px;
}

.movie-info .casts .casts-content .cast-item img {
    height: 120px;
    width: 90px;
}

.movie-info .casts .casts-content .cast-item .item-title {
    color: #333;
    padding: 8px 0 5px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.movie-info .casts .casts-content .no-result {
    text-align: center;
    font-size: 12px;
    color: #ff4500;
}

.no-wrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.border-top-1px {
    position: relative;
}

.border-top-1px::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #ccc;
    transform: scaleY(0.5);
    transform-origin: 0 0;
}

.border-bottom-1px {
    position: relative;
}

.border-bottom-1px::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #e0e0e0;
    transform: scaleY(0.5);
    transform-origin: 0 0;
}
</style>