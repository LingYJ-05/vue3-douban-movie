<template>
    <div class="user-center">
        <!-- 用户信息区域 -->
        <div class="user">
            <div class="avatar">
                <img src="./avatar.jpg" alt="用户头像" width="80" height="80">
            </div>
            <div class="name">用户名</div>
        </div>

        <!-- 切换标签 -->
        <div class="switch-item">
            <switches :items="switches" :currentIndex="currentIndex" @switch="switchTab"></switches>

            <!-- 显示内容区域 -->
            <scroll class="list-scroll" ref="scrollRef">
                <div class="user-item">
                    <!-- 显示数量 -->
                    <div class="movie-num">
                        共 {{ itemLength }} 项
                    </div>

                    <!-- 列表内容 -->
                    <div class="rank-list" v-if="currentIndex !== 2">
                        <rank-list :movies="itemLists" @select="selectMovie"></rank-list>
                    </div>

                    <!-- 影人列表 -->
                    <div class="celebrity-list" v-else>
                        <celebrity-list :celebrities="itemLists" @select="selectCelebrity"></celebrity-list>
                    </div>

                    <!-- 开发中提示 -->
                    <div class="develop" v-if="itemLength === 0">
                        暂无内容，敬请期待
                    </div>
                </div>
            </scroll>
        </div>
    </div>
</template>
<script setup name="UserCenter">
import { ref, computed, nextTick, watch, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Switches from '../../base/switches/switches.vue'
import RankList from '../../components/rank-list/rank-list.vue'
import CelebrityList from '../../components/celebrity-list/celebrity-list.vue'

// 定义emit事件
const emit = defineEmits(['hasLoad']);

//创建响应式对象
const currentIndex = ref(0)
const switches = ref([
    { name: '想看', count: 0 },
    { name: '看过', count: 0 },
    { name: '影人', count: 0 }
])
const itemLists = ref([])
const itemLength = ref(0)

//创建引用
const scrollRef = ref(null)

//创建路由和store实例
const router = useRouter()
const store = useStore()

//计算属性
const wantedMovie = computed(() => store.getters.wantedMovies)
const watchedMovie = computed(() => store.getters.watchedMovies)
const collectedCelebrities = computed(() => store.getters.collectedCelebrities)

//方法定义
// 选择电影
const selectMovie = (movie) => {
    router.push({
        path: `/movie-detail/${movie.id}`
    })
    // 在vuex中设置当前电影
    store.commit('SET_MOVIE', movie)
}
//选择影人
const selectCelebrity = (id) => {
    router.push({
        path: `/celebrity/${id}`
    })
    // 在vuex中设置当前影人
    store.commit('SET_CELEBRITY_ID', id)
}

//切换标签
const switchTab = (index) => {
    currentIndex.value = index

    //根据索引切换标签
    switch (index) {
        case 0: //想看列表
            itemLists.value = wantedMovie.value
            break;
        case 1: //看过列表
            itemLists.value = watchedMovie.value
            break;
        case 2: //影人列表
            itemLists.value = collectedCelebrities.value
            break;
    }
    
    //更新列表长度
    itemLength.value = itemLists.value.length

    //刷新滚动组件并滚动到顶部
    nextTick(() => {
        if (scrollRef.value && scrollRef.value.scrollTo) {
            scrollRef.value.scrollTo(0, 0)
        }
        if (scrollRef.value && scrollRef.value.refresh) {
            scrollRef.value.refresh()
        }
    })
}
//监听器
// 监听"想看"电影列表变化
watch(wantedMovie, (newLists) => {
    if (currentIndex.value === 0 && newLists) { // 如果当前显示的是"想看"列表且数据不为空
        itemLists.value = newLists;
        itemLength.value = newLists.length;
        // 更新列表计数
        switches.value[0].count = newLists.length;
    }
});

// 监听"看过"电影列表变化
watch(watchedMovie, (newLists) => {
    if (currentIndex.value === 1 && newLists) { // 如果当前显示的是"看过"列表且数据不为空
        itemLists.value = newLists;
        itemLength.value = newLists.length;
        // 更新列表计数
        switches.value[1].count = newLists.length;
    }
});

// 监听"收藏影人"列表变化
watch(collectedCelebrities, (newLists) => {
    if (currentIndex.value === 2 && newLists) { // 如果当前显示的是"影人"列表且数据不为空
        itemLists.value = newLists;
        itemLength.value = newLists.length;
        // 更新列表计数
        switches.value[2].count = newLists.length;
    }
});

// 组件挂载后执行的逻辑
onMounted(() => {
    // 初始化数据，添加空值检查
    const initialMovies = wantedMovie.value || [];
    itemLists.value = initialMovies;
    itemLength.value = initialMovies.length;
    
    // 更新所有列表计数
    switches.value[0].count = wantedMovie.value?.length || 0;
    switches.value[1].count = watchedMovie.value?.length || 0;
    switches.value[2].count = collectedCelebrities.value?.length || 0;

    // 通知父组件已经加载完成
    emit('hasLoad');
});

// 处理keep-alive激活时的逻辑
onActivated(() => {
    nextTick(() => {
        if (scrollRef.value && scrollRef.value.refresh) {
            scrollRef.value.refresh();
        }
    });
});
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