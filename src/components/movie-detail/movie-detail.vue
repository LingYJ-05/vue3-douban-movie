<template>
    <div class="detail-wrapper">
        <div class="fixed-title">
            <span class="back" @click="back">
                <i class="icon-back">←</i>
            </span>
            <span class="type" ref="fixedRef">
                <span class="icon" v-show="!changeFix">
                    <i class="icon-video-camera">🎥</i>
                    电影
                </span>
                <span class="movie-name" v-if="changeFix" v-text="movieDetail.title"></span>
            </span>
        </div>
        <scroll class="movie-detail" :data="movieDetail" :probeType="probeType" :listenScroll="listenScroll"
            @scroll="scroll" ref="scrollRef">
            <div class="scroll-wrapper">
                <div class="scroll-centent" v-if="movieDetail.images">
                    <div class="bg-image" ref="imageRef">
                        <img :src="replaceUrl(movieDetail.images?.large)" @error="handleImageError" />
                    </div>
                    <!-- <moive-info/> -->
                    <div class="switch">
                        <Switches :switch="switches" :currentIndex="currentIndex" @switches="switchItem"></Switches>
                    </div>
                    <!-- <movie-comment></movie-comment> -->
                    <movie-review v-show="currentIndex === 0" :review="movieDetail.popular_review.slice(0, 5)"
                        :reviewNum="movieDetail.review._count" @selectReview="selectReview"
                        @needAllReview="needAllReview"></movie-review>
                </div>
            </div>
            <load-more :fullScreen="fullScreen" v-show="!movieDetail.images"></load-more>
        </scroll>
        <router-view></router-view>
    </div>
</template>


<script setup name="movieDetail">
import LoadMore from '../../base/loadmore/loadmore.vue';
import Scroll from '../../base/scroll/scroll.vue';
import Switches from '../../base/switches/switches.vue';
import { ref, computed, nextTick, onMounted } from 'vue'
import MovieReview from '../../components/movie-review/movie-review.vue'
import { useStore } from 'vuex'
import { getMovieDetail } from '../../api/movie-detail.js';
import { useRouter, useRoute } from 'vue-router';
// 定义路由参数
const router = useRouter()
const store = useStore()
const route = useRoute()

//定义响应式数据
const scrollRef = ref(null)
const fixedRef = ref(null)
const imageRef = ref(null)
const movieDetail = ref(null)
const fullScreen = ref(true)
const currentIndex = ref(0)
const scrollY = ref(-1)
const imgHeight = ref(-1)
const changeFix = ref(false)


//静态数据
const switches = [
    { name: 短评 },
    { name: 影评 },
]
//配置数据
const probeType = ref(3)
const listenScroll = ref(true)


//从vuex获取数据
const movie = computed(() => {
    return store.getters.movie
})


// 方法
// 返回上一页
const back = () => {
    router.back()
}
// 切换tab
const switchItem = (index) => {
    currentIndex.value = index
    nextTick(() => {
        scrollRef.value?.refresh()
    })
}
//选择演员 
//选择影评
// 查看所有短评
//查看所有影评

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
    e.target.src = 'https://via.placeholder.com/300x450?text=电影海报'
}
//滚动事件处理
const scroll = (pro) => {
    scrollY.value = pro.y
    if (-imgHeight.value > pro.y && imgHeight !== -1) {
        changeFix.value = true
    } else {
        changeFix.value = false
    }
}

//获取电影详情
const getDetail = async () => {
    // 如果电影没有id 返回电影的列表项
    if (!movie.value.id) {
        router.push('/movie-show')
        return
    }
    //真正开始获取电影详情
    try {
        const res = await getMovieDetail(movie.value.id)
        if (!route.params.movieId) {
            return
        }
        movieDetail.value = res
        // 直接设置图片高度（不依赖懒加载）
        setTimeout(() => {
            if (!router.params.movieId) {
                return
            }
            imgHeight.value = getImageHeight()
            scrollRef.value?.refresh()
        }, 100)
    } catch (err) {
        console.error('获取电影详情失败', err)
    }
}
//获取图片高度
const getImageHeight = () => {
    return imageRef.value?.clientHeight || 0
}
const needAllReview = () => {
    store.commit('SET_DISCUSSION_TYPE', 'comment')
    router.push({
        path: `/movie-detail/${movie.value.id}/reviews`
    })
}

const selectReview = (id) => {
    store.commit('SET_SELECTED_REVIEW', id)
    router.push({
        path: `/movie-detail/${movie.value.id}/reviews`
    })
}
// const needAllComment = () => {
//     store.commit('SET_DISCUSSION_TYPE', 'comment')
//     router.push({
//         path: `/movie-detail/${movie.value.id}/comments`
//     })
// }
//生命周期钩子
onMounted(() => {
    probeType.value = 3
    listenScroll.value = true
    getDetail()
})
</script>

<style scoped>
.detail-wrapper {
    position: relative;
    z-index: 10;
}

.detail-wrapper .fixed-title {
    position: fixed;
    top: 0;
    width: 100%;
    height: 40px;
    z-index: 100;
    background-color: rgba(85, 85, 85, 0.6);
    text-align: center;
}

.detail-wrapper .fixed-title .back {
    position: absolute;
    top: 0px;
    left: 6px;
    z-index: 50;
}

.detail-wrapper .fixed-title .back .icon-back {
    display: block;
    padding: 10px;
    font-size: 16px;
    color: #fff;
}

.detail-wrapper .fixed-title .type .icon {
    position: absolute;
    left: 50%;
    top: 0;
    color: #fff;
    display: block;
    padding: 10px;
    transform: translateX(-50%);
}

.detail-wrapper .fixed-title .type .icon .icon-video-camera {
    display: inline-block;
    vertical-align: text-bottom;
    font-size: 18px;
}

.detail-wrapper .fixed-title .type .movie-name {
    display: block;
    padding-top: 11px;
    width: 100%;
    color: #fff;
}

.detail-wrapper .movie-detail {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f8f8f8;
}

.detail-wrapper .movie-detail .bg-image {
    text-align: center;
    padding: 50px 0 20px 0;
    background-color: #f8f8f8;

}

.detail-wrapper .movie-detail .bg-image img {
    width: 50%;
}

.detail-wrapper .movie-detail .switch {
    padding: 0 20px;
    background-color: #fff;
    padding-top: 20px;
}
</style>
