<template>
    <div class="suggest-wrapper">
        <div class="to-top" @click="toTop" v-show="result.length">
            <span>返回顶部</span>
        </div>
        <Scroll class="suggest" :pullup="pullup" :beforeScroll="enableBeforeScroll" @beforeScroll="listScroll"
            @scrollEnd="searchMore" ref="suggestRef">
            <ul class="suggest-list">
                <li class="suggest-item" v-for="item in result" :key="item?.id || item?.title || 'unknown'"
                    v-if="item && typeof item === 'object' && item.subtype !== 'tv'" @click="selectItem(item)">
                    <div class="item-pic">
                        <img v-lazy="replaceImgUrl(item?.image)" width="50" height="70" @error="handleImageError"
                            :alt="(item?.title || '未知电影') + '海报'">
                    </div>
                    <div class="item-info">
                        <div class="title">{{ item?.title || '未知电影' }}</div>
                        <div class="info">
                            <span class="rating">{{ getRating(item?.rating) }}</span>
                            <span class="pubdate">{{ getPubDate(item?.pubdate) }}</span>
                        </div>
                    </div>
                </li>
                <!-- 加载更多 -->
                <load-more :hasMore="hasMore" @loadMore="loadMore" v-if="result.length"></load-more>
            </ul>
            <div class="no-result" v-if="noResult">抱歉，暂无搜索结果 :(</div>
        </Scroll>
    </div>
</template>

<script setup name="suggest">
import Scroll from '../../base/scroll/scroll.vue'
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import LoadMore from '../../base/loadmore/loadmore.vue'
import { movieSearch, tagSearch } from '../../api/movie-search.js'
import { createSearchList } from '../../common/js/movieList.js'

const props = defineProps({
    query: {
        type: String,
        default: ''
    },
    tagSearch: {
        type: String,
        default: ''
    },
})

//定义emit
const emit = defineEmits(['select', 'listScroll'])
//定义Router
const router = useRouter()
const store = useStore()

//响应式数据
const suggestRef = ref(null)
const searchIndex = ref(0)
const result = ref([])
const hasMore = ref(true)
const noResult = ref(false)
const pullup = ref(false)
const enableBeforeScroll = ref(true)
const loadingFlag = ref(true)
const fullScreen = ref(true)
const dataFn = ref(null)
const SEARCH_MORE = 20

// 滚动到顶部
const toTop = () => {
    if (suggestRef.value && suggestRef.value.scroll) {
        suggestRef.value.scroll.scrollTo(0, 0, 200);
    }
}

const search = async () => {
    result.value = []
    hasMore.value = true
    loadingFlag.value = true
    searchIndex.value = 0
    if (suggestRef.value && suggestRef.value.scroll) {
        suggestRef.value.scroll.scrollTo(0, 0)//回到顶部
    }
    try {
        // 根据当前模式选择搜索参数
        const searchParam = props.tagSearch || props.query
        const res = await dataFn.value(searchParam, searchIndex.value, SEARCH_MORE)
        // 确保res不为空且有subjects属性
        if (!res || !res.subjects) {
            noResult.value = true
            loadingFlag.value = false
            return
        }
        //判断有误搜索结果
        if (!res.subjects.length) {
            noResult.value = true
            return
        } else {
            noResult.value = false
        }
        // 过滤掉非对象类型的数据
        const validSubjects = res.subjects.filter(subject => subject && typeof subject === 'object')
        result.value = createSearchList(validSubjects)
    } catch (err) {
        // console.log('search error', err)
    }
}

const searchMore = async () => {
    //防止重复加载
    if (!loadingFlag.value || !hasMore.value) { // ✅ 修复：修正条件逻辑
        return
    }
    loadingFlag.value = false
    searchIndex.value += SEARCH_MORE
    try {
        // 根据当前模式选择搜索参数
        const searchParam = props.tagSearch || props.query
        const res = await dataFn.value(searchParam, searchIndex.value, SEARCH_MORE)
        // 确保res不为空且有subjects属性
        if (res && res.subjects) {
            // 过滤掉非对象类型的数据
            const validSubjects = res.subjects.filter(subject => subject && typeof subject === 'object')
            result.value = result.value.concat(createSearchList(validSubjects))//合并数据
            checkMore(res)
        }
        loadingFlag.value = true
    } catch (err) {
        loadingFlag.value = true
        // console.log('search error', err)
    }
}

const getPubDate = (data) => {
    if (!data || !data.length) return ''
    let pubdate = ''
    for (let i = 0; i < data.length; i++) {
        if (data[i].indexOf('电影节') === -1) {
            pubdate = data[i]
        }
        if (data[i].indexOf('中国大陆') > -1) {
            pubdate = data[i]
            break
        }
    }
    return pubdate ? '/' + pubdate : ''
}

const getRating = (rate) => {
    if (!rate || rate === 0) {
        return '暂无评分'
    }
    return rate + '分'
}

// 跳转详情页
const selectItem = (item) => {
    if (item && item.id) {
        router.push({
            path: `/movie/${item.id}`
        })
        // 设置当前电影到vuex
        store.commit('SET_MOVIE', item)
        // 派发事件用于更新搜索
        emit('select')
    } else {
        console.error('无法跳转到详情页：电影ID无效')
    }
}

// 添加loadMore函数以解决报错问题
const loadMore = () => {
    // 可以留空或者调用searchMore
    console.log('滚动到底部，加载更多')
}

const listScroll = () => {
    //移动端搜索时，键盘防遮挡
    emit('listScroll')
}

//图片防盗锁和错误处理
const replaceImgUrl = (srcUrl) => {
    try {
        // 确保srcUrl是有效的字符串
        if (!srcUrl || typeof srcUrl !== 'string') {
            // 返回占位图作为默认值
            return 'https://dummyimage.com/80x120/ccc/fff&text=Movie+Poster'
        }

        // 如果URL已经是占位图或weserv.nl代理的URL，则不再处理
        if (srcUrl.includes('dummyimage.com') || srcUrl.includes('weserv.nl')) {
            return srcUrl
        }

        // 移除协议部分并添加图片代理服务
        return 'https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, '').replace('/img/', '/img/w100/')
    } catch (error) {
        console.error('图片URL处理错误:', error)
        return 'https://dummyimage.com/80x120/ccc/fff&text=Movie+Poster'
    }
}

// 处理图片加载错误
const handleImageError = (e) => {
    // console.log('电影海报加载失败，使用占位图')
    e.target.src = 'https://dummyimage.com/80x120/ccc/fff&text=Movie+Poster'
}

const checkMore = (data) => {
    if (!data || !data.subjects || !data.subjects.length || data.start + data.count >= data.total) {
        hasMore.value = false
    }
}

const selectType = (movie) => {
    store.commit('SET_MOVIE', movie)
}

// 在组件挂载时初始化dataFn
onMounted(() => {
    // 根据props初始化dataFn
    if (props.tagSearch) {
        dataFn.value = tagSearch
    } else if (props.query) {
        dataFn.value = movieSearch
    }
    // 触发搜索
    if (dataFn.value && (props.tagSearch || props.query)) {
        search()
    }
})

// 监听props变化，重新初始化dataFn
watch(() => [props.tagSearch, props.query], ([newTag, newQuery]) => {
    if (newTag) {
        dataFn.value = tagSearch
    } else if (newQuery) {
        dataFn.value = movieSearch
    }
    // 触发搜索
    if (dataFn.value && (newTag || newQuery)) {
        search()
    }
}, { immediate: true })

watch(
    () => props.query,
    (newQuery) => {
        if (newQuery) {
            // 如果是普通搜索模式
            if (!props.tagSearch) {
                dataFn.value = movieSearch
                result.value = []
                search()
            }
        }
    }
)

// 监听tagSearch属性变化
watch(
    () => props.tagSearch,
    (newTagSearch) => {
        if (newTagSearch) {
            // 切换到标签搜索模式
            dataFn.value = tagSearch
            result.value = []
            search()
        } else if (props.query) {
            // 如果没有标签搜索但有查询词，切换回普通搜索
            dataFn.value = movieSearch
            result.value = []
            search()
        }
    }
)
</script>

<style scoped>
.suggest-wrapper {
    height: 100%;
}

.suggest-wrapper .to-top {
    box-sizing: border-box;
    height: 22px;
    position: fixed;
    right: 0;
    top: 80%;
    z-index: 800;
    padding: 5px;
    background: #ff5a5f;
    color: #fff;
    text-align: center;
    font-size: 12px;
}

.suggest-wrapper .suggest {
    height: 100%;
    overflow: hidden;
}

.suggest-wrapper .suggest .suggest-list {
    padding: 15px;
}

.suggest-wrapper .suggest .suggest-list .suggest-item {
    margin-top: 15px;
    height: 70px;
    display: flex;
}

.suggest-wrapper .suggest .suggest-list .suggest-item:first-child {
    margin-top: 0;
}

.suggest-wrapper .suggest .suggest-list .suggest-item .item-pic {
    flex: 0 0 50px;
    width: 50px;
    margin-right: 10px;
}

.suggest-wrapper .suggest .suggest-list .suggest-item .item-info {
    flex: 1;
    padding-bottom: 30px;
}

.suggest-wrapper .suggest .suggest-list .suggest-item .item-info .title {
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
}

.suggest-wrapper .suggest .suggest-list .suggest-item .item-info .info {
    font-size: 0;
}

.suggest-wrapper .suggest .suggest-list .suggest-item .item-info .info span {
    font-size: 12px;
    color: #999;
}

.suggest-wrapper .suggest .no-result {
    position: absolute;
    top: 50%;
    width: 100%;
    text-align: center;
}
</style>