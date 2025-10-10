<template>
    <div class="rank-wrapper">
        <!-- 顶部标题栏 -->
        <div class="fixed-title">
            <span class="back" @click="back">
                <i class="icon-back">←</i>
            </span>
            <span class="type">{{ rankType }}</span>
        </div>

        <!-- Top250 分页切换 -->
        <Switches v-if="isTop250" :switches="switches" :currentIndex="currentIndex" :smallFont="true"
            @switch="switchTab" style="z-index: 200;" />
        <!-- 调试信息 -->
        <div style="color: red; text-align: center; font-size: 12px;">
            isTop250: {{ isTop250 }}, rankType: {{ rankType }}
        </div>

        <Scroll :data="currentRankList" :pullup="true" :probeType="3" :listenScroll="true" @scrollToEnd="loadMore"
            @scroll="handleScroll" class="rank-list-wrapper" ref="scrollRef">
            <div class="rank-content" :class="{ 'more-padding': isTop250 }">
                <RankList :rankItems="currentRankList" :hasMore="hasMore" @select="selectMovie" />
            </div>
            <LoadMore :fullScreen="true" v-if="!currentRankList.length" />
        </Scroll>
    </div>
</template>

<script setup name="RankDetail">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { createRankList } from '../../common/js/movieList';
import { top250Rank, weeklyRank, newMoviesRank, usRank } from '../../api/movie-rank';
import Switches from '../../base/switches/switches.vue';
import Scroll from '../../base/scroll/scroll.vue';
import RankList from '../rank-list/rank-list.vue';
import LoadMore from '../../base/loadmore/loadmore.vue';

// 路由和状态
const route = useRoute();
const router = useRouter();
const store = useStore();

// 基础数据
const rankType = ref('豆瓣 Top250');
const dataFn = ref(top250Rank);
const isTop250 = ref(true);

// 分页数据（仅Top250使用）
const currentIndex = ref(0);
const switches = ref([
    { name: '1-50' },
    { name: '51-100' },
    { name: '101-150' },
    { name: '151-200' },
    { name: '201-250' }
]);

// 列表数据
const rankLists = ref([]); // 存储所有分页的数据
const hasMore = ref(true);
const isLoading = ref(false);
// const start = ref(0);


// 滚动引用
const scrollRef = ref(null);

// 当前显示的列表
const currentRankList = computed(() => {
    return isTop250.value ? rankLists.value[currentIndex.value] || [] : rankLists.value[0] || [];
});

// 方法
const back = () => router.back('/rank');

const handleScroll = (pos) => {
    if (pos > 0) {
        store.commit('SET_SCROLL_POSITION', pos);
    }
    // 滚动到上次保存的位置
    if (pos === 0) {
        pos = store.state.scrollPosition || 0;
    }
    // 滚动到指定位置
    if (scrollRef.value) {
        scrollRef.value.scrollTo(0, pos, 300);
    }
    // 保存当前滚动位置
    store.commit('SET_SCROLL_POSITION', pos);

};

const switchTab = (index) => {
    currentIndex.value = index;

    // 如果当前分页没有数据，加载数据
    if (!rankLists.value[index]) {
        // index为点击的索引 如果是0-50 则从0开始加载 如果index=1 则51-100以此类推
        loadRankData(index * 50, 50, index);
    }

    // 刷新滚动组件
    nextTick(() => {
        if (scrollRef.value) {
            scrollRef.value.refresh();
        }
    });
};

const selectMovie = (movie) => {
    router.push(`/movie/${movie.id}`);
    store.commit('SET_MOVIE', movie);
};

const loadMore = async () => {
    //正在加载或者不需要更多数据时
    if (isLoading.value || !hasMore.value) return;
    isLoading.value = true;

    const startIndex = isTop250.value ?
    //当前页面是从index50并且+已经加载的数据
        currentIndex.value * 50 + currentRankList.value.length :
        //
        rankLists.value[0]?.length || 0;

    try {
        await loadRankData(startIndex, 10, currentIndex.value);
    } finally {
        isLoading.value = false;
    }
};

const loadRankData = async (start, count, index) => {
    const res = await dataFn.value(start, count);
    const newMovies = createRankList(res.subjects);

    if (!rankLists.value[index]) {
        rankLists.value[index] = [];
    }

    if (start === 0 || !isTop250.value) {
        rankLists.value[index] = newMovies;
    } else {
        rankLists.value[index] = [...rankLists.value[index], ...newMovies];
    }

    // 检查是否还有更多数据
    hasMore.value = res.subjects.length === count &&
        res.start + res.count < (isTop250.value ? 50 : 100); // 根据榜单类型设置上限
};

const selectType = () => {
    const type = route.params.rankType;
    const typeConfig = {
        'top250': { fn: top250Rank, name: '豆瓣 Top250', isTop250: true },
        'weekly': { fn: weeklyRank, name: '本周口碑榜', isTop250: false },
        'new': { fn: newMoviesRank, name: '新片榜', isTop250: false },
        'us': { fn: usRank, name: '北美票房榜', isTop250: false }
    };

    const config = typeConfig[type];
    if (config) {
        dataFn.value = config.fn;
        rankType.value = config.name;
        isTop250.value = config.isTop250;
    }
};

const getRankList = async () => {
    await loadRankData(0, isTop250.value ? 50 : 100, currentIndex.value);
};

onMounted(() => {
    selectType();
    getRankList();
});
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

/* 修复Switches组件的样式 */
.switches {
    position: fixed;
    top: 50px;
    width: 100%;
    height: auto;
    z-index: 200;
    background-color: #fff;
    margin: 0;
    padding: 0;
}

/* 确保switches-item的样式正确 */
.switches-item {
    list-style: none !important;
    margin: 0 !important;
    padding: 0 !important;
}

/* 修复滚动容器的样式 */
.rank-list-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 100;
}

.rank-content {
    padding: 50px 15px 40px 15px;
}

.rank-content.more-padding {
    padding-top: 90px;
}

/* 确保ul和li没有默认样式 */
.switches ul, .switches li {
    list-style: none !important;
    margin: 0 !important;
    padding: 0 !important;
}
</style>