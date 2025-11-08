<template>
    <transition name="fade">
        <div class="search">
            <!-- 搜索框 -->
            <search-box @query="onQueryChange" :tagSearch="tagSearch" ref="searchBox" v-show="!tagSearch" />

            <!-- 固定标题栏 -->
            <div class="fixed-title" v-show="tagSearch">
                <span class="back" @click="back">
                    <el-button type="primary" color="gray"> 
                        <el-icon>
                            <ArrowLeftBold />
                        </el-icon>
                    </el-button>
                </span>
                <span class="type">关于{{ localQuery || '搜索' }}的电影</span>
            </div>

            <!-- 快捷搜索 -->
            <div class="shortcut-wrapper" v-show="!localQuery">
                <div class="tag-list">
                    <div class="douban-tag tag">
                        <span v-for="item in doubanTag" :key="item" @click="tagSearchChange(item)">
                            {{ item }}
                        </span>
                    </div>
                    <div class="movie-tag tag">
                        <span v-for="item in movieTag" :key="item" @click="tagSearchChange(item)">
                            {{ item }}
                        </span>
                    </div>
                    <div class="country-tag tag">
                        <span v-for="item in countryTag" :key="item" @click="tagSearchChange(item)">
                            {{ item }}
                        </span>
                    </div>
                </div>

                <div class="search-history">
                    <h1 class="title">
                        <span class="text">搜索历史</span>
                        <span class="clear" @click="showConfirm">
                            <el-button type="primary" icon="Delete" />
                        </span>
                    </h1>
                    <history-list :searches="searchHistory" @selected="addQuery" @delete="deleteOne" />
                </div>
            </div>

            <!-- 搜索结果 -->
            <div class="search-result" v-show="localQuery" ref="searchResult">
                <suggest :query="localQuery" :tag-search="tagSearch"></suggest>
            </div>
            <confirm ref="confirm" text="确定要清空搜索历史吗？" confirmBtnText="清空" @confirm="clearSearchHistory" />

        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SearchBox from '../../base/search-box/search-box.vue'
import HistoryList from '../../base/history-list/history-list.vue'
import Suggest from '../../components/suggest/suggest.vue'
import Confirm from '../../base/confirm/confirm.vue'

// 响应式数据
const route = useRoute()
const confirm = ref(null)
const searchBox = ref(null)
const searchResult = ref(null)
const scroll = ref(null)
const tagSearch = ref('')
const localQuery = ref('')
const searchHistory = ref([])

// 标签数据
const doubanTag = ['经典', '豆瓣高分', '冷门佳片']
const movieTag = ['剧情', '爱情', '喜剧', '科幻', '动作', '悬疑', '治愈', '青春', '文艺']
const countryTag = ['中国', '美国', '日本', '韩国', '英国', '法国', '德国', '意大利', '西班牙', '澳大利亚']

// 页面加载时处理路由参数
onMounted(() => {
    if (route.query.q) {
        addQuery(route.query.q)
    }
})

// 搜索历史管理
function addQuery(query) {
    if (!query?.trim()) return

    const safeQuery = String(query).trim()
    if (!searchHistory.value.includes(safeQuery)) {
        searchHistory.value.push(safeQuery)
    }
    localQuery.value = safeQuery
}

function deleteOne(item) {
    // 保留不等于删除项的其他项
    searchHistory.value = searchHistory.value.filter(i => i !== item)
}

// 清空搜索历史
function clearSearchHistory() {
    searchHistory.value = []
}

function showConfirm() {
    confirm.value.show()
}

// 搜索相关
function onQueryChange(query) {
    addQuery(query)
}

function tagSearchChange(query) {
    localQuery.value = query
    tagSearch.value = query
}

function back() {
    localQuery.value = ''
    tagSearch.value = ''
    if (route.path !== '/') {
    }
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