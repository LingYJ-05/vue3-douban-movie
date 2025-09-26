<template>
    <div class="movie-review">
        <!-- 条件渲染标题 -->
        <div class="type-title" v-if="needTitle">
            影评{{ reviewNum }}条
        </div>

        <!-- 影评列表 -->
        <ul>
            <li v-for="review in reviews" :key="review.id" class="review-item" @click="selectReview(review.id)">
                <div class="content">
                    <!-- 影评标题 -->
                    <h1 class="title">{{ review.title }}</h1>

                    <!-- 用户信息区域 -->
                    <div class="user-info">
                        <div class="avatar">
                            <!-- 懒加载头像图片 -->
                            <img v-lazy="review.author.avatar" alt="" width="25" height="25">
                        </div>
                        <!-- 用户名 -->
                        <span class="name">{{ review.author.name }}</span>
                        <!-- 星级评分组件 -->
                        <Star :size="24" :score="review.rating.value * 2" />
                    </div>

                    <!-- 影评摘要 -->
                    <p class="desc">{{ review.summary }}</p>
                </div>
            </li>
        </ul>

        <!-- 全部影评按钮（当不需要标题时显示） -->
        <div v-if="!needTitle" class="allReview" @click="needAllReviews">
            <span>全部影评{{ reviewNum }}个</span>
        </div>

        <!-- 加载更多组件（当需要标题且有数据时显示） -->
        <Loadmore :hasMore="hasMore" v-if="needTitle" v-show="reviews.length" />
    </div>
</template>

<script setup>
// 导入组件
import Star from '../../base/star/star.vue';
import Loadmore from '../../base/loadmore/loadmore.vue';

// 定义组件名称
defineOptions({
  name: 'MovieReview'
});

// 定义props - 从父组件接收数据
const props = defineProps({
  // 影评数组
  reviews: {
    type: Array,
    default: () => []
  },
  // 影评总数
  reviewNum: {
    type: Number,
    default: 0
  },
  // 是否需要显示标题
  needTitle: {
    type: Boolean,
    default: true
  },
  // 是否还有更多数据
  hasMore: {
    type: Boolean,
    default: true
  }
});

// 定义emit - 向父组件发送事件
const emit = defineEmits(['selectReview', 'needAllReviews']);

// 方法：选择某个影评（点击影评项时触发）
const selectReview = (id) => {
  // 向父组件发送selectReview事件，传递影评id
  emit('selectReview', id);
};

// 方法：需要显示所有影评（点击"全部影评"时触发）
const needAllReviews = () => {
  // 向父组件发送needAllReviews事件
  emit('needAllReviews');
};
</script>

<style scoped>
.movie-review {
    padding: 20px;
    background: #f5f5f5;
}

.movie-review .type-title {
    font-size: 16px;
    margin-bottom: 15px;
}

.movie-review .review-item {
    margin-bottom: 20px;
}

.movie-review .review-item .content {
    font-size: 14px;
}

.movie-review .review-item .content .title {
    font-size: 18px;
    color: #333;
    padding: 5px 0;
}

.movie-review .review-item .content .user-info {
    padding: 5px 0;
}

.movie-review .review-item .content .user-info .avatar {
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
}

.movie-review .review-item .content .user-info .avatar img {
    border-radius: 50%;
}

.movie-review .review-item .content .user-info .name {
    display: inline-block;
    vertical-align: middle;
}

.movie-review .review-item .content .user-info .star {
    display: inline-block;
    vertical-align: middle;
}

.movie-review .review-item .content .desc {
    line-height: 20px;
}

.movie-review .allReview {
    font-size: 16px;
    color: #ff6b6b;
    text-align: center;
    padding-bottom: 10px;
}
</style>
