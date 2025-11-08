<template>
    <div class="suggest-wrapper">
        <!-- 返回顶部按钮 -->
        <el-button 
            v-show="result.length" 
            class="to-top-btn"
            type="primary"
            @click="toTop"
        >
            <el-icon><Top /></el-icon>
            返回顶部
        </el-button>

        <!-- 加载状态 -->
        <el-skeleton v-if="loading && !result.length" :rows="6" animated />

        <!-- 空状态 -->
        <el-empty 
            v-else-if="noResult || (!result.length && !loading)" 
            description="暂无相关电影"
        />

        <!-- 电影列表 -->
        <div v-else class="movie-list">
            <!-- 电影卡片列表 -->
            <el-card 
                v-for="(item, index) in result" 
                :key="item?.id || item?.title || 'unknown' + index"
                v-if="item && typeof item === 'object'"
                :body-style="{ padding: '15px' }"
                class="movie-card"
                shadow="hover"
                @click="selectItem(item)"
            >
                <div class="movie-item">
                    <div class="item-pic">
                        <el-image 
                            :src="replaceImgUrl(item?.image || item?.images?.large)" 
                            fit="cover"
                            :alt="(item?.title || '未知电影') + '海报'"
                            lazy
                        >
                            <template #error>
                                <div class="image-slot">
                                    <el-icon><Picture /></el-icon>
                                </div>
                            </template>
                        </el-image>
                    </div>
                    <div class="item-info">
                        <h3 class="title">{{ item?.title || '未知电影' }}</h3>
                        <div class="info">
                            <el-rate 
                                v-if="item?.rating?.average" 
                                :value="item.rating.average / 2" 
                                disabled 
                                show-score 
                                text-color="#ff9900" 
                                score-template="{value}"
                                class="rating"
                            />
                            <span v-else class="no-rating">暂无评分</span>
                            <p class="pubdate">{{ getPubDate(item?.pubdate || item?.year) }}</p>
                        </div>
                    </div>
                </div>
            </el-card>

            <!-- 加载更多 -->
            <div v-if="hasMore && result.length" class="load-more">
                <el-button 
                    :loading="!loadingFlag" 
                    @click="searchMore"
                    type="primary"
                    plain
                >
                    {{ !loadingFlag ? '加载中...' : '加载更多' }}
                </el-button>
            </div>

            <!-- 没有更多数据 -->
            <div v-if="!hasMore && result.length" class="no-more">
                <el-divider>没有更多了</el-divider>
            </div>
        </div>
    </div>
</template>

<script setup name="suggest">
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Top, Picture } from '@element-plus/icons-vue'
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

// 定义 emit
const emit = defineEmits(['select', 'listScroll'])
const router = useRouter()
const store = useStore()

// 响应式数据
const searchIndex = ref(0)
const result = ref([])
const hasMore = ref(true)
const noResult = ref(false)
const loading = ref(false)
const loadingFlag = ref(true)
const dataFn = ref(null)
const SEARCH_MORE = 20

// 滚动到顶部
const toTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const search = async () => {
    result.value = []
    hasMore.value = true
    noResult.value = false
    searchIndex.value = 0
    loading.value = true
    
    try {
        // 根据当前模式选择搜索参数
        const searchParam = props.tagSearch || props.query
        if (!searchParam) {
            loading.value = false
            return
        }
        
        const res = await dataFn.value(searchParam, searchIndex.value, SEARCH_MORE)
        
        // 确保 res 不为空且有 subjects 属性
        if (!res || !res.subjects) {
            noResult.value = true
            loading.value = false
            return
        }
        
        // 判断有无搜索结果
        if (!res.subjects.length) {
            noResult.value = true
            loading.value = false
            return
        } else {
            noResult.value = false
        }
        
        // 过滤掉非对象类型的数据
        const validSubjects = res.subjects.filter(subject => 
            subject && typeof subject === 'object'
        )
        
        // 兼容不同数据结构
        const processedItems = validSubjects.map(subject => {
            // 如果是豆瓣 API 的标准格式
            if (subject.images && !subject.image) {
                subject.image = subject.images.large
            }
            // 如果是简单对象
            if (subject.year && !subject.pubdate) {
                subject.pubdate = [subject.year]
            }
            return subject
        })
        
        result.value = processedItems // 直接使用，不再经过 createSearchList
        
        // 检查是否还有更多数据
        checkMore(res)
        
    } catch (err) {
        console.error('搜索错误:', err)
        noResult.value = true
    } finally {
        loading.value = false
    }
}

const searchMore = async () => {
    // 防止重复加载
    if (!loadingFlag.value || !hasMore.value) {
        return
    }
    
    loadingFlag.value = false
    
    try {
        // 根据当前模式选择搜索参数
        const searchParam = props.tagSearch || props.query
        if (!searchParam) return
        
        const res = await dataFn.value(searchParam, searchIndex.value + SEARCH_MORE, SEARCH_MORE)
        
        // 确保 res 不为空且有 subjects 属性
        if (res && res.subjects) {
            // 过滤掉非对象类型的数据
            const validSubjects = res.subjects.filter(subject => 
                subject && typeof subject === 'object'
            )
            
            // 兼容不同数据结构
            const processedItems = validSubjects.map(subject => {
                if (subject.images && !subject.image) {
                    subject.image = subject.images.large
                }
                if (subject.year && !subject.pubdate) {
                    subject.pubdate = [subject.year]
                }
                return subject
            })
            
            result.value = [...result.value, ...processedItems] // 合并数组
            checkMore(res)
        }
    } catch (err) {
        console.error('加载更多错误:', err)
    } finally {
        loadingFlag.value = true
        searchIndex.value += SEARCH_MORE
    }
}

const getPubDate = (data) => {
    if (!data) return '上映时间未知'
    
    // 如果是字符串数组
    if (Array.isArray(data)) {
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
        return pubdate ? '上映时间: ' + pubdate : '上映时间未知'
    }
    
    // 如果是字符串
    if (typeof data === 'string') {
        return '上映时间: ' + data
    }
    
    return '上映时间未知'
}

const selectItem = (item) => {
    if (item && item.id) {
        router.push({
            path: `/movie/${item.id}`
        })
        // 设置当前电影到 vuex
        store.commit('SET_MOVIE', item)
        // 派发事件用于更新搜索
        emit('select')
    } else {
        console.error('无法跳转到详情页：电影ID无效')
    }
}

const listScroll = () => {
    // 移动端搜索时，键盘防遮挡
    emit('listScroll')
}

// 图片防盗链和错误处理
const replaceImgUrl = (srcUrl) => {
    try {
        // 确保 srcUrl 是有效的字符串
        if (!srcUrl || typeof srcUrl !== 'string') {
            return 'https://dummyimage.com/80x120/ccc/fff&text=Movie+Poster'
        }

        // 如果 URL 已经是占位图或 weserv.nl 代理的 URL，则不再处理
        if (srcUrl.includes('dummyimage.com') || srcUrl.includes('weserv.nl')) {
            return srcUrl
        }

        // 移除协议部分并添加图片代理服务
        return 'https://images.weserv.nl/?url=' + 
               srcUrl.replace(/http\w{0,1}:\/\//, '').replace('/img/', '/img/w100/')
    } catch (error) {
        console.error('图片URL处理错误:', error)
        return 'https://dummyimage.com/80x120/ccc/fff&text=Movie+Poster'
    }
}

const checkMore = (data) => {
    if (!data || !data.subjects || !data.subjects.length || 
        (data.start !== undefined && data.count !== undefined && data.total !== undefined && 
         data.start + data.count >= data.total)) {
        hasMore.value = false
    } else {
        hasMore.value = true
    }
}

// 在组件挂载时初始化 dataFn
onMounted(() => {
    // 根据 props 初始化 dataFn
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

// 监听 props 变化，重新初始化 dataFn
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

// 监听 query 属性变化
watch(
    () => props.query,
    (newQuery) => {
        if (newQuery && !props.tagSearch) {
            dataFn.value = movieSearch
            search()
        }
    }
)

// 监听 tagSearch 属性变化
watch(
    () => props.tagSearch,
    (newTagSearch) => {
        if (newTagSearch) {
            // 切换到标签搜索模式
            dataFn.value = tagSearch
            search()
        } else if (props.query) {
            // 如果没有标签搜索但有查询词，切换回普通搜索
            dataFn.value = movieSearch
            search()
        }
    }
)
</script>

<style scoped>
.suggest-wrapper {
    padding: 15px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.to-top-btn {
    position: fixed;
    right: 20px;
    bottom: 80px;
    z-index: 1000;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    padding: 0;
}

.movie-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
}

.movie-card {
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    margin-bottom: 10px;
}

.movie-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.movie-item {
    display: flex;
    align-items: flex-start;
}

.item-pic {
    width: 60px;
    height: 80px;
    margin-right: 15px;
    flex-shrink: 0;
}

.item-pic .el-image {
    width: 100%;
    height: 100%;
    border-radius: 4px;
}

.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
}

.item-info {
    flex: 1;
    min-width: 0;
}

.title {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 500;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.info {
    font-size: 12px;
}

.rating {
    margin-bottom: 5px;
}

.no-rating {
    color: #999;
    font-size: 12px;
}

.pubdate {
    color: #666;
    margin: 0;
    font-size: 12px;
}

.load-more {
    text-align: center;
    margin: 20px 0;
}

.no-more {
    text-align: center;
    margin: 20px 0;
}

.el-skeleton {
    margin: 15px 0;
}

.el-empty {
    margin-top: 100px;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .movie-list {
        grid-template-columns: 1fr;
        gap: 10px;
    }
    
    .movie-item {
        flex-direction: row;
    }
    
    .item-pic {
        width: 50px;
        height: 70px;
    }
}
</style>