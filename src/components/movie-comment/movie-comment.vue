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
import { computed } from 'vue';
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
  return favoriteComments.value.includes(id);
};

// 标记评论点赞
const markItem = (id, index) => {
  if (isLike(id)) {
    // 取消点赞
    store.dispatch('removeFavoriteComment', id);
  } else {
    // 点赞
    store.dispatch('addFavoriteComment', id);
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
  padding: 0 15px;
}

.type-title {
  font-size: 18px;
  margin: 15px 0;
}

.comment-item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
}

.avatar {
  margin-right: 10px;
  flex-shrink: 0;
}

.avatar img {
  border-radius: 50%;
}

.content {
  flex: 1;
}

.name {
  font-size: 14px;
  color: #333;
  margin: 0;
}

.text {
  font-size: 14px;
  line-height: 1.5;
  margin: 8px 0;
}

.date {
  font-size: 12px;
  color: #999;
}

.useful-count {
  display: inline-block;
  margin-left: 15px;
  padding: 0 5px;
  font-size: 12px;
  color: #999;
}

.useful-count.like {
  color: #00bcd4;
}

.icon-thumb_up {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xMC45OCAzLjc2aC0zLjE5bC0uMT3FjLTEuMTUu0zEyLjIgNS43OUwxNiA0LjA0VjE0Ljl2LS4wM2wzLjk5LTQtMS44LTMuOTktMy4wNC0xLjI1LTQuMTMgMC40OUw4LjUgMTMuMTZMMi40IDQuNDlsLTMuOTkgNCAzLjk5IDQgMy45OS00IDQtMy45OUwxMi4yIDEuOCA5LjIgNS43OUwxMC45OCAzLjc2eiIgZmlsbD0iIzAwQkNEQiIgZmlsbC1vcGFjaXR5PSIwLjQiLz4KPC9zdmc+');
  background-size: 100%;
  vertical-align: middle;
}

.allComment {
  padding: 15px 0;
  text-align: center;
  color: #666;
  font-size: 14px;
  border-bottom: 1px solid #e0e0e0;
}
</style>