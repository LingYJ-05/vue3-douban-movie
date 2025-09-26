<template>
    <div class="rank-wrapper">
        <!-- 顶部标题栏 -->
        <div class="fixed-title">
            <span class="back" @click="back">
                <i class="icon-back">←</i>
            </span>
            <span class="type">
                <span>{{ rankType }}</span>
            </span>
        </div>
        <!-- Top250 分页切换 -->
        <Switches v-if="rankType === '豆瓣 Top250'" :switches="switches" :currentIndex="currentIndex"
            :smallFont="smallFont" @switch="switchTab" />
        <Scroll v-for="(scrollItem, index) in switches" v-show="currentIndex === index" :data="RankList[index]"
            :pullup="pullup" :key="index" :probeType="probeType" :listenScroll="listenScroll" @scrollToEnd="loadMore"
            @scroll="scroll" class="rank-list-wrapper" ref="scrollRef">
            <div class="rank-content" :class="{ 'more-padding': rankType === '豆瓣 Top250' }">
                <RankList :rankItems="rankList[index]" :hasMore="hasMore" :page="index" @select="selectMovie" />
            </div>
            <LoadMore :fullScreen="fullScreen" v-if="!rankList[index].length" />
        </Scroll>
    </div>


</template>


<script setup name="RankDetail">
import { ref, nextTick, onMounted, onBeforeMount } from 'vue';
import Switches from '../../base/switches/switches.vue';
import Scroll from '../../base/scroll/scroll.vue';
import RankList from '../rank-list/rank-list.vue';
import LoadMore from '../../base/loadmore/loadmore.vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex'
import { createRankList } from '../../common/js/movieList'
import { top250Rank, weeklyRank, newMoviesRank, usRank } from '../../api/movie-rank';

//定义响应式数据
const route = useRoute();
const router = useRouter();
const store = useStore();

const SEARCH_MORE = 10
//基本数据
const rankType = ref('')
const dataFn = ref(null)
const currentIndex = ref(0)
const fullScreen = ref(true)
const pullup = ref(true)
const probeType = ref(3)
const listenScroll = ref(true)

//分页相关
const switches = ref([
    { name: '1-50' },
    { name: '51-100' },
    { name: '101-150' },
    { name: '151-200' },
    { name: '201-250' }
])
const smallFont = ref(true)
const movieIndex = ref([0, 50, 100, 150, 200])
const scrollY = ref([0, 0, 0, 0, 0])
//列表数据
const rankList = ref({})
const hasMore = ref([false, false, false, false, false])
const loadingFlag = ref(true)

//滚动引用
const scrollRef = ref(null)

//方法
//返回上一页
const back = () => {
    router.back('/rank')
}
//滚动事件处理
const scroll = (pos) => {
    scrollY.value[currentIndex.value] = pos.y
}
//切换标签分页
const switchTab = (index) => {
    currentIndex.value = index
    loadingFlag.value = true

    nextTick(() => {
        //重新计算滚动位置
        if (scrollRef.value && scrollRef.value.length > 0) {
            scrollRef.value.forEach((item) => {
                item.scrollTo(0, scrollY.value[index])
                setTimeout(() => {
                    item.refresh()
                }, 20)
            })
        }
        if (!rankList.value[index] || (rankList.value[index] && rankList.value[index].length === 0)) {
            hasMore.value[index] = true
            dataFn.value(movieIndex.value[index], SEARCH_MORE).then((res) => {
                rankList.value[index] = createRankList(res.subjects)
            })
        }
    })
}

//选择电影
const selectMovie = (movie) => {
    router.push(`/movie/${movie.id}`)
    store.commit('SET_MOVIE', movie)
}
//加载更多数据
const loadMore = () => {
    const index = currentIndex.value
    //防止重复数据
    if (!loadingFlag.value) {
        return
    }
    loadingFlag.value = false
    if (!hasMore.value[index]) {
        return
    }
    movieIndex.value[index] += SEARCH_MORE
    dataFn.value(movieIndex.value[index], SEARCH_MORE).then((res) => {
        rankList.value[index] = rankList.value[index].concat(createRankList(res.subjects))
        checkMore(res)
        loadingFlag.value = true
    })
}

//检查是否还有更多数据
const checkMore = (data) => {
    const movies = data.subjects
    const end = 50 * (currentIndex.value + 1)
    if (!movies.length || data.start + data.count >= end) {
        hasMore.value[currentIndex.value] = false
    }
}

//选择榜单类型
const selectType = () => {
    const type = route.params.rankType

    switch (type) {
        case 'top250':
            dataFn.value = top250Rank
            rankType.value = '豆瓣 Top250'
            break
        case 'weekly':
            dataFn.value = weeklyRank
            rankType.value = '本周口碑榜'
            break
        case 'new':
            dataFn.value = newMoviesRank
            rankType.value = '新片榜'
            break
        case 'us':
            dataFn.value = usRank
            rankType.value = '北美票房榜'
            break
    }
}

//获取榜单数据
const getRankList = () => {
    if (rankType.value !== '豆瓣 Top250') {
        //非top250榜单
        dataFn.value().then((res) => {
            rankList.value[0] = createRankList(res.subjects)
        })
    } else {
        //top250榜单分页
        dataFn.value(movieIndex.value[0], SEARCH_MORE).then((res) => {
            rankList.value[0] = createRankList(res.subjects)
            hasMore.value[0] = true
        })
    }
}
//生命周期
onBeforeMount(() => {
    //为每个分页初始化空数组
    for (let i = 0; i < switches.value.length; i++) {
        rankList.value[i] = []
    }
})
onMounted(() => {
    selectType()
    getRankList()
})
</script>

<style scoped>
.rank-wrapper {
    position: relative;
    z-index: 10;
}

.fixed-title {
    position: fixed;
    top: 0;
    width: 100%;
    height: 50px;
    z-index: 200;
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
}

.back {
    position: absolute;
    top: 0px;
    left: 6px;
    z-index: 50;
    cursor: pointer;
}

.icon-back {
    display: block;
    padding: 15px;
    font-size: 16px;
    color: #ff4d4d;
}

.type {
    line-height: 50px;
    font-size: 16px;
    padding-left: 60px;
    color: #333;
}

.switches {
    position: fixed;
    top: 50px;
    width: 100%;
    height: 40px;
    z-index: 200;
    background-color: #fff;
}

.rank-list-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
}

.rank-content {
    padding: 50px 15px 40px 15px;
}

.rank-content.more-padding {
    padding-top: 90px;
}
</style>