<template>
    <div class="movie-review">
        <!-- 条件渲染标题 -->
        <div class="type-title" v-if="needTitle">
            影评{{ reviewNum }}条
        </div>

        <!-- 影评列表 -->
        <div v-if="reviews.length">
            <el-card 
                v-for="review in reviews" 
                :key="review.id" 
                class="review-item" 
                @click="selectReview(review.id)"
                shadow="hover"
            >
                <!-- 影评标题 -->
                <template #header>
                    <div class="card-header">
                        <h1 class="title">{{ review.title }}</h1>
                    </div>
                </template>

                <!-- 用户信息区域 -->
                <div class="user-info">
                    <el-image 
                        :src="review.author.avatar" 
                        alt="" 
                        class="avatar" 
                        :lazy="true"
                        fit="cover"
                    ></el-image>
                    <!-- 用户名 -->
                    <span class="name">{{ review.author.name }}</span>
                    <!-- 星级评分组件 -->
                    <el-rate 
                        v-model="review.rating.value" 
                        :max="5" 
                        allow-half 
                        readonly 
                        size="small"
                    />
                </div>

                <!-- 影评摘要 -->
                <p class="desc">{{ review.summary }}</p>
            </el-card>
        </div>

        <!-- 空状态 -->
        <el-empty v-else description="暂无影评数据"></el-empty>

        <!-- 全部影评按钮（当不需要标题时显示） -->
        <el-button 
            v-if="!needTitle" 
            class="all-review-btn" 
            @click="needAllReviews"
            type="text"
            size="default"
        >
            全部影评{{ reviewNum }}个
        </el-button>

        <!-- 加载更多（当需要标题且有数据时显示） -->
        <div v-if="needTitle && reviews.length" class="load-more">
            <el-button 
                v-if="hasMore" 
                loading 
                plain
                size="small"
                :disabled="true"
            >
                加载中...
            </el-button>
            <span v-else class="no-more">没有更多数据了</span>
        </div>
    </div>
</template>

<script setup>
// 导入Element Plus组件
import { ElCard, ElImage, ElRate, ElEmpty, ElButton } from 'element-plus';

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
    font-weight: 500;
}

.movie-review .review-item {
    margin-bottom: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.movie-review .review-item:hover {
    transform: translateY(-2px);
}

.movie-review .review-item .card-header {
    padding: 0;
}

.movie-review .review-item .title {
    font-size: 18px;
    color: #333;
    margin: 0;
    font-weight: 500;
}

.movie-review .review-item .user-info {
    padding: 10px 0;
    display: flex;
    align-items: center;
}

.movie-review .review-item .user-info .avatar {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-right: 10px;
}

.movie-review .review-item .user-info .name {
    margin-right: 15px;
    color: #606266;
}

.movie-review .review-item .user-info .el-rate {
    margin-left: auto;
}

.movie-review .review-item .desc {
    line-height: 1.6;
    color: #606266;
    margin: 0;
    font-size: 14px;
}

.movie-review .all-review-btn {
    display: block;
    margin: 0 auto;
    color: #ff6b6b;
    font-size: 16px;
    padding: 10px 0;
}

.movie-review .load-more {
    text-align: center;
    padding: 20px 0;
}

.movie-review .no-more {
    color: #909399;
    font-size: 14px;
}

/* 空状态样式 */
.movie-review :deep(.el-empty) {
    padding: 40px 0;
}
</style>
