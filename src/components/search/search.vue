<template>
    <transition name="fade">
        <!-- 搜索页 -->
        <div class="search">
            <!-- 使用 search-box 组件 -->
            <search-box @query="onQueryChange" :tagSearch="tagSearch" ref="searchBox" v-show="!tagSearch"></search-box>

            <div class="fixed-title" v-show="tagSearch">
                <span class="back" @click="back">
                    <span class="icon-back">←</span>
                </span>
                <span class="type">
                    <span>关于{{ localQuery || '搜索' }}的电影</span>
                </span>
            </div>
            <div class="shortcut-wrapper" v-show="!localQuery">
                <div class="">
                    <div class="tag-list">
                        <div class="douban-tag tag">
                            <span v-for="item in doubanTag" :key="item" @click="tagSearchChange(item)">{{ item }}</span>
                        </div>
                        <div class="movie-tag tag">
                            <span v-for="item in movieTag" :key="item" @click="tagSearchChange(item)">{{ item }}</span>
                        </div>
                        <div class="country-tag tag">
                            <span v-for="item in countryTag" :key="item" @click="tagSearchChange(item)">{{ item
                                }}</span>
                        </div>
                    </div>
                    <div class="search-history">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="clearConfirm">
                                <i class="icon-bin">🗑️</i>
                            </span>
                        </h1>
                        <history-list :searches="searchHistory" @selected="addQuery" @delete="deleteOne"></history-list>
                    </div>
                </div>
            </div>
            <!-- 搜索结果 -->
            <div class="search-result" v-show="localQuery" ref="searchResult" :class="{ 'tag-search': tagSearch }">
                <suggest :query="localQuery" :tag-search="tagSearch"></suggest>
            </div>
            <confirm ref="confirm" text="确定要清空搜索历史吗？" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
        </div>
    </transition>
</template>

<script setup name="search">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// 使用正确的相对路径导入 search-box 组件
import SearchBox from '../../base/search-box/search-box.vue'
import HistoryList from '../../base/history-list/history-list.vue'
import Suggest from '../../components/suggest/suggest.vue'
import Confirm from '../../base/confirm/confirm.vue'


const confirm = ref(null)
const route = useRoute()
const searchResult = ref(null)
const searchBox = ref(null) // 添加 searchBox 引用
const tagSearch = ref('')
const localQuery = ref('') // 使用一个新的局部变量
const doubanTag = ['经典', '豆瓣高分', '冷门佳片'];
const movieTag = ['剧情', '爱情', '喜剧', '科幻', '动作', '悬疑', '治愈', '青春', '文艺'];
const countryTag = ['中国', '美国', '日本', '韩国', '英国', '法国', '德国', '意大利', '西班牙', '澳大利亚'];
const searchHistory = ref([])

// 处理路由参数
onMounted(() => {
    // 从路由参数中获取搜索词
    if (route.query && route.query.q) {
        const searchQuery = route.query.q
        // console.log('从路由参数获取搜索词:', searchQuery)
        addQuery(searchQuery)
    }
})


function clearSearchHistory(){
    // 真正执行清空操作的函数
    // console.log('清空搜索历史')
    searchHistory.value = []
}

// 点击清空按钮时显示确认对话框
function clearConfirm() {
    confirm.value.show()
}

// 返回
function back() {
    localQuery.value = ''
    tagSearch.value = ''
}

function addQuery(query) {
    // 确保query是有效的字符串
    if (!query || typeof query !== 'string' || query.trim() === '') {
        // console.warn('无效的搜索词');
        return;
    }
    const safeQuery = getSafeQueryString(query)
    if (safeQuery && !searchHistory.value.includes(safeQuery)) {
        searchHistory.value.push(safeQuery)
        localQuery.value = safeQuery
    }
}

function deleteOne(item) {
    searchHistory.value = searchHistory.value.filter(i => i !== item)
}

function onQueryChange(query) {
    // 确保query是安全的字符串
    const safeQuery = getSafeQueryString(query)
    if (safeQuery) {
        addQuery(safeQuery)
    }
}

function tagSearchChange(query) {
    // 确保query是安全的字符串
    const safeQuery = getSafeQueryString(query)
    if (safeQuery) {
        localQuery.value = safeQuery
        tagSearch.value = safeQuery
    }
}

// 辅助函数：获取安全的查询字符串
function getSafeQueryString(value) {
    // 检查是否是Promise对象
    if (value && typeof value === 'object' && typeof value.then === 'function') {
        console.warn('接收到Promise对象作为查询参数，无法直接使用')
        return ''
    }

    // 确保返回一个字符串
    if (value === null || value === undefined) {
        return ''
    }

    if (typeof value === 'object') {
        try {
            // 尝试将对象序列化为JSON字符串
            return JSON.stringify(value)
        } catch (e) {
            // 如果序列化失败，返回toString结果
            return String(value)
        }
    }

    // 对于原始类型，直接转换为字符串
    return String(value).trim()
}

</script>

<style scoped>
.search {
    position: fixed;
    z-index: 500;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f5f5f5;
}

/* 添加缺失的样式 */
.fixed-title {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
}

.back {
    margin-right: 20px;
    cursor: pointer;
    font-size: 16px;
    color: #999;
}

.type {
    flex: 1;
    text-align: center;
}

.tag-list {
    top: 50px;
    padding: 15px;
    cursor: pointer
}

.tag {
    margin-bottom: 15px;
}

.tag span {
    display: inline-block;
    padding: 5px 10px;
    margin: 5px;
    background-color: #42bd56;
    color: #fff;
    border-radius: 5px;
}

.search-history {
    padding: 0 15px;
}

.title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-top: 1px solid #eee;
}

.title .text {
    font-size: 16px;
    color: #333;
}

.clear {
    cursor: pointer;
    padding: 5px;
    color: #42bd56;
}

.icon-bin {
    font-size: 16px;
    color: #42bd56;

}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>