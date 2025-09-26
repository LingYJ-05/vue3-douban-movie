<template>
    <div class="discussion-wrapper">
        <!-- 固定标题栏 -->
        <div class="fixed-title">
            <span class="back" @click="back">
                <i class="icon-back"></i>
            </span>
            <span class="type">{{ title }}</span>
            <span class="to-top" @click="toTop">
                <i class="icon-circle-up"></i>
            </span>
        </div>

        <!-- 滚动容器 -->
        <scroll class="all-discuss" :data="discussions" :pullup="pullup" @scrollToEnd="loadMore" ref="scrollRef">
            <div class="discuss-content">
                <!-- 评论组件 -->
                <movie-comment v-if="currentDiscussionType === 'comment'" :comments="discussions"
                    :commentNum="discussionNum" :needTitle="needTitle" :hasMore="hasMore"></movie-comment>

                <!-- 影评组件 -->
                <movie-review v-else :reviews="discussions" :reviewNum="discussionNum" :needTitle="needTitle"
                    :hasMore="hasMore" @selectReview="selectReview"></movie-review>
            </div>

            <!-- 加载动画 -->
            <loadmore :fullScreen="fullScreen" v-if="!discussions.length && !noResult"></loadmore>

            <!-- 无结果提示 -->
            <div class="no-result" v-if="noResult">这里什么都没有呃 :(</div>
        </scroll>
    </div>
</template>

<script setup name="AllDiscussion">
// 1. 导入需要的模块
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import MovieComment from '../../components/movie-comment/movie-comment.vue';
import MovieReview from '../../components/movie-review/movie-review.vue';
import Scroll from '../../base/scroll/scroll.vue';
import Loadmore from '../../base/loadmore/loadmore.vue';
import { getAllReviews, getAllComments } from '../../api/movie-detail';

// 2. 常量定义
const SEARCH_MORE = 20;

// 3. 创建响应式数据
const discussionIndex = ref(0); // 当前加载的索引
const discussions = ref([]); // 讨论列表数据
const discussionNum = ref(0); // 总讨论数量
const pullup = ref(true); // 是否支持上拉加载
const hasMore = ref(true); // 是否还有更多数据
const noResult = ref(false); // 是否无结果
const fullScreen = ref(true); // 是否全屏显示
const needTitle = ref(true); // 是否需要标题
const loadingFlag = ref(true); // 加载标志，控制加载速度

// 4. 创建引用
const scrollRef = ref(null);

// 5. 创建路由和store实例
const router = useRouter();
const store = useStore();

// 6. 计算属性
// 页面标题
const title = computed(() => {
    return `${store.getters.movie.title}的全部${type.value}`;
});

// 讨论类型（短评或影评）
const type = computed(() => {
    return store.getters.currentDiscussionType === 'comment' ? '短评' : '影评';
});

// 从store中获取的getter
const currentDiscussionType = computed(() => store.getters.currentDiscussionType);
const movie = computed(() => store.getters.movie);

// 7. 方法定义

// 返回上一页
const back = () => {
    router.back();
};

// 返回顶部
const toTop = () => {
    if (scrollRef.value && scrollRef.value.scrollTo) {
        scrollRef.value.scrollTo(0, 0, 500); // 滚动到顶部，带动画效果
    }
};

// 选择影评
const selectReview = (id) => {
    store.commit('SET_REVIEW_ID', id);
    router.push({
        path: `/movie/${movie.value.id}/review/${id}`
    });
};

// 加载更多数据
const loadMore = () => {
    // 如果正在加载或没有更多数据，直接返回
    if (!loadingFlag.value || !hasMore.value) {
        // console.log('quick');
        return;
    }

    // 开始加载
    loadingFlag.value = false;
    discussionIndex.value += SEARCH_MORE; // 增加查找索引

    // 获取数据
    getData.value(movie.value.id, discussionIndex.value, SEARCH_MORE)
        .then((res) => {
            // 合并新数据
            discussions.value = discussions.value.concat(res[discussType.value]);
            // 检查是否还有更多数据
            _checkMore(res);
            // 重置加载标志
            loadingFlag.value = true;
        });
};

// 获取所有讨论数据
const _getAllDiscussions = () => {
    // 如果没有讨论类型，跳转到主页
    if (!currentDiscussionType.value) {
        router.push('/movie-show');
        return;
    }

    // 判断是否为评论类型
    const isComment = currentDiscussionType.value === 'comment';
    discussType.value = isComment ? 'comments' : 'reviews';
    getData.value = isComment ? getAllComments : getAllReviews;

    // 获取数据
    getData.value(movie.value.id, discussionIndex.value, SEARCH_MORE)
        .then((res) => {
            discussions.value = res[discussType.value];
            noResult.value = discussions.value.length ? false : true;
            discussionNum.value = res.total;
            _checkMore(res); // 检查是否还有更多数据
        });
};

// 检查是否还有更多数据
const _checkMore = (data) => {
    const discussionsList = data.comments || data.reviews;
    if (!discussionsList.length || data.start + data.count > data.total) {
        hasMore.value = false;
    }
};

// 8. 响应式变量（需要在setup中定义）
const discussType = ref('');
const getData = ref(null);

// 9. 组件挂载后执行
onMounted(() => {
    _getAllDiscussions();
});
</script>

<style scoped>
.discussion-wrapper {
    height: 100%;
}

.discussion-wrapper .fixed-title {
    position: relative;
    position: fixed;
    top: 0;
    width: 100%;
    height: 50px;
    z-index: 200;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
}

.discussion-wrapper .fixed-title .back {
    position: absolute;
    top: 0px;
    left: 6px;
    z-index: 50;
}

.discussion-wrapper .fixed-title .back .icon-back {
    display: block;
    padding: 15px;
    font-size: 18px;
    color: #ff4500;
}

.discussion-wrapper .fixed-title .type {
    line-height: 50px;
    font-size: 16px;
    padding-left: 50px;
}

.discussion-wrapper .fixed-title .to-top {
    position: absolute;
    top: 0;
    right: 6px;
    z-index: 50;
}

.discussion-wrapper .fixed-title .to-top .icon-circle-up {
    display: block;
    padding: 15px;
    font-size: 20px;
    color: #ff4500;
}

.discussion-wrapper .all-discuss {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 150;
    overflow: hidden;
    background-color: #f5f5f5;
}

.discussion-wrapper .all-discuss .discuss-content {
    padding-top: 50px;
}

.discussion-wrapper .all-discuss .no-result {
    position: absolute;
    top: 50%;
    width: 100%;
    text-align: center;
}
</style>