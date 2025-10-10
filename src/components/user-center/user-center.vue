<template>
    <div class="user-center">
        <!-- 用户信息 -->
        <div class="user">
            <div class="avatar">
                <img src="./avatar.jpg" alt="用户头像" width="80" height="80">
            </div>
            <div class="name">用户名</div>
        </div>

        <!-- 标签切换 -->
        <div class="switch-item">
            <!-- 标签组件 -->
            <Switches :items="switches" :currentIndex="currentIndex" @switch="switchTab" />

            <!-- 滚动容器 -->
            <Scroll class="list-scroll" ref="scrollRef">
                <div class="user-item">
                    <!-- 显示数量 -->
                    <div class="movie-num">共 {{ itemLength }} 项</div>

                    <!-- 电影列表 -->
                    <RankList v-if="currentIndex !== 2" :movies="itemLists" @select="selectMovie" />

                    <!-- 影人列表 -->
                    <CelebrityList v-else :celebrities="itemLists" @select="selectCelebrity" />

                    <!-- 空状态提示 -->
                    <div class="develop" v-if="itemLength === 0">
                        暂无内容，敬请期待
                    </div>
                </div>
            </Scroll>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Switches from '../../base/switches/switches.vue'
import RankList from '../../components/rank-list/rank-list.vue'
import CelebrityList from '../../components/celebrity-list/celebrity-list.vue'

// 响应式数据
const router = useRouter()
const store = useStore()
const currentIndex = ref(0)

// 标签配置
const switches = ref([
    { name: '想看', count: 0 },
    { name: '看过', count: 0 },
    { name: '影人', count: 0 }
])

// 列表数据
const itemLists = ref([])
const itemLength = ref(0)

// 滚动组件引用
const scrollRef = ref(null)

// 从 Vuex 获取数据
const wantedMovie = computed(() => store.getters.wantedMovies)
const watchedMovie = computed(() => store.getters.watchedMovies)
const collectedCelebrities = computed(() => store.getters.collectedCelebrities)
// 根据当前索引获取对应数据
const getCurrentList = (index) => {
    switch (index) {
        case 0: return wantedMovie.value
        case 1: return watchedMovie.value
        case 2: return collectedCelebrities.value
        default: return []
    }
}

// 切换标签
const switchTab = (index) => {
    currentIndex.value = index
    updateListData()
    scrollToTop()
}

// 更新列表数据
const updateListData = () => {
    const currentList = getCurrentList(currentIndex.value)
    itemLists.value = currentList || []
    itemLength.value = itemLists.value.length
}
// 滚动到顶部并刷新
const scrollToTop = async () => {
    await nextTick()
    if (scrollRef.value?.scrollTo) {
        scrollRef.value.scrollTo(0, 0)
    }
    if (scrollRef.value?.refresh) {
        scrollRef.value.refresh()
    }
}

// 选择电影
const selectMovie =(movie)=>{
    store.commit('SET_MOVIE',movie)
    router.push(`/movie-detail/${movie.id}`)
}
// 选择影人
const selectCelebrity =(id)=>{
    store.commit('SET_CELEBRITY_ID',id)
    router.push(`/celebrity/${id}`)
}

// 监听数据变化
watch([watchedMovie,wantedMovie,collectedCelebrities],()=>{
    //更新标签计计数
    switches.value[0].count =watchedMovie.value?.length || 0
    switches.value[1].count =wantedMovie.value?.length || 0
    switches.value[2].count =collectedCelebrities.value?.length || 0
  // 如果当前显示的是对应列表，更新数据
  if (itemLists.value.length !== itemLength.value) {
    updateListData()
  }
}, { immediate: true })

// 组件挂载时初始化
onMounted(() => {
    updateListData()
})
</script>
<style scoped>
.user-center {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 61px;
    background-color: #f8f8f8;
    overflow: hidden;
}

.user-center .user {
    box-sizing: border-box;
    width: 100%;
    height: 150px;
    background: linear-gradient(#00ff4c, #6bff84);
    padding: 35px 50px 35px 20px;
    display: flex;
    align-items: center;
}

.user-center .user .avatar {
    flex: 0 0 80px;
    width: 80px;
}

.user-center .user .avatar img {
    border-radius: 50%;
}

.user-center .user .name {
    flex: 1;
    color: #f5f5f5;
    font-size: 18px;
}

.user-center .switch-item {
    position: absolute;
    top: 150px;
    width: 100%;
    bottom: 0;
    overflow: hidden;
}

.user-center .switch-item .user-item .movie-num {
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    font-size: 14px;
}

.user-center .switch-item .user-item .rank-list {
    background: #f5f5f5;
}

.user-center .switch-item .user-item .develop {
    text-align: center;
    color: #ff4500;
}
</style>