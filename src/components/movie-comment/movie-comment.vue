<template>
  <div class="movie-comment">
    <!-- 短评标题 -->
    <div class="type-title" v-if="needTitle">
      短评{{ commentNum }}条
    </div>

    <!-- 评论列表 -->
    <ul>
      <li v-for="(comment, index) in comments" :key="comment.id" class="comment-item">
        <div class="avatar">
          <img v-lazy="replaceUrl(comment.author.avatar)" width="36" height="36">
        </div>
        <div class="content">
          <h1 class="name">{{ comment.author.name }}</h1>
          <Star :size="24" :score="comment.rating.value * 2"></Star>
          <p class="text">{{ comment.content }}</p>
          <span class="date">{{ comment.created_at }}</span>
          <div class="useful-count" @click="markItem(comment.id, index)" :class="{ 'like': isLike(comment.id) }">
            <i class="icon-thumb_up"></i>
            {{ comment.useful_count }}
          </div>
        </div>
      </li>
    </ul>

    <!-- 查看全部短评 -->
    <div class="allComment" @click="needAllComments" v-if="!needTitle">
      <span>全部短评{{ commentNum }}个</span>
    </div>

    <!-- 加载更多 -->
    <Loadmore :hasMore="hasMore" v-if="needTitle" v-show="comments.length"></Loadmore>
  </div>
</template>

<script setup>
// 1. 导入需要的模块
import { defineProps, defineEmits, computed } from 'vue';
import { useStore } from 'vuex';
import Star from '../../base/star/star.vue';
import Loadmore from '../../base/loadmore/loadmore.vue';

// 2. 定义props
const props = defineProps({
  comments: {
    type: Array,
    default: () => []
  },
  commentNum: {
    type: Number,
    default: 0
  },
  needTitle: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: true
  }
});

// 3. 定义emit事件
const emit = defineEmits(['needAllComments']);

// 4. 创建store实例
const store = useStore();

// 5. 计算属性
const favoriteComments = computed(() => store.getters.favoriteComments);

// 6. 方法定义

// 需要全部评论
const needAllComments = () => {
  emit('needAllComments');
};

// 检查是否已点赞
const isLike = (id) => {
  const index = favoriteComments.value.findIndex((item) => {
    return item === id;
  });
  return index > -1;
};

// 标记评论（点赞/取消点赞）
const markItem = (id, index) => {
  // 提交action
  store.dispatch('markComment', id);

  // 进行模拟点赞加减的操作，不为真实数据
  const commentIndex = favoriteComments.value.findIndex((item) => {
    return item === id;
  });

  if (commentIndex > -1) {
    // 如果已点赞，点击后取消点赞，有用数减1
    props.comments[index].useful_count = Math.max(0, props.comments[index].useful_count - 1);
  } else {
    // 如果未点赞，点击后点赞，有用数加1
    props.comments[index].useful_count += 1;
  }
};

// 图片URL处理（防盗链）
const replaceUrl = (srcUrl) => {
  if (srcUrl) {
    return 'https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, '');
  }
  return '';
};
</script>

<style scoped>
.movie-comment {
  padding: 20px;
  background: #f5f5f5;
}

.movie-comment .type-title {
  font-size: 14px;
  margin-bottom: 15px;
}

.movie-comment .comment-item {
  display: flex;
  margin-bottom: 20px;
}

.movie-comment .comment-item .avatar {
  flex: 0 0 36px;
  width: 36px;
  margin-right: 12px;
}

.movie-comment .comment-item .avatar img {
  border-radius: 50%;
}

.movie-comment .comment-item .content {
  flex: 1;
  position: relative;
  font-size: 14px;
  color: #333;
}

.movie-comment .comment-item .content .name {
  display: inline-block;
  line-height: 25px;
  margin-right: 5px;
}

.movie-comment .comment-item .content .star {
  display: inline-block;
}

.movie-comment .comment-item .content .text {
  line-height: 20px;
}

.movie-comment .comment-item .content .date {
  font-size: 12px;
  color: #666;
  line-height: 25px;
}

.movie-comment .comment-item .content .useful-count {
  position: absolute;
  color: #666;
  top: 5px;
  right: 5px;
}

.movie-comment .comment-item .content .useful-count.like {
  color: #ff4500;
}

.movie-comment .allComment {
  font-size: 14px;
  color: #ff4500;
  text-align: center;
  padding-bottom: 10px;
}
</style>