<template>
  <div class="detail-wrapper">
    <!-- 固定标题栏 -->
    <div class="fixed-title">
      <span class="back" @click="back">
        <i class="icon-back"></i>
      </span>
      <span class="type" ref="fixedRef">
        影人
      </span>
    </div>

    <!-- 影人详情内容 -->
    <scroll class="celebrity-detail" v-if="celebrityDetail.avatars" :data="celebrityDetail">
      <div class="scroll-wrapper">
        <!-- 头像区域 -->
        <div class="bg-image" ref="imageRef">
          <img v-lazy="replaceUrl(celebrityDetail.avatars?.large)" />
        </div>

        <!-- 影人信息 -->
        <div class="celebrity-info">
          <div class="main">
            <h1 class="name-cn">{{ celebrityDetail.name }}</h1>
            <span class="name-en">{{ celebrityDetail.name_en }}</span>

            <!-- 收藏按钮 -->
            <div class="collect" @click="saveCollect" :class="{ 'has-collected': isCollected }">
              <i class="icon" :class="collectClass"></i>
              <span class="text">{{ collectText }}</span>
            </div>
          </div>

          <!-- 个人简介 -->
          <div class="brief">
            <div class="title">个人简介</div>
            <p class="text" @click="showInfo">
              {{ celebrityDetail.summary }}
              <span class="more"><i class="icon-keyboard_arrow_right"></i></span>
            </p>
          </div>

          <!-- 代表作品 -->
          <scroll class="works" :scrollX="scrollX" :eventPassthrough="eventPassthrough" ref="scrollRef"
            v-if="works.length">
            <div class="works-content" ref="contentRef">
              <h2 class="title">代表作品</h2>
              <div class="work-item" v-for="item in works" :key="item.id" @click="selectWork(item)">
                <img v-lazy="replaceUrl(item.image)" width="90" height="120">
                <h3 class="item-title">{{ item.title }}</h3>
                <Star :score="item.rating" :showScore="showScore"></Star>
              </div>
            </div>
          </scroll>

          <!-- 查看全部作品 -->
          <div class="allWorks" @click="getAllWorks">
            查看全部作品
            <i class="icon-keyboard_arrow_right"></i>
          </div>
        </div>
      </div>
    </scroll>

    <!-- 加载动画 -->
    <loadmore :fullScreen="fullScreen" v-if="!celebrityDetail.avatars"></loadmore>

    <!-- 影人信息弹窗 -->
    <celebrity-info :infoLists="celebrityDetail" ref="infoRef"></celebrity-info>

    <!-- 子路由 -->
    <router-view></router-view>
  </div>
</template>

<script setup>
// 1. 导入需要的模块
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Scroll from 'base/scroll/scroll';
import Loadmore from 'base/loadmore/loadmore';
import Star from '../../base/star/star.vue';
import CelebrityInfo from 'components/celebrity-info/celebrity-info';
import { createMovieList } from '../../common/js/movieList';
import Celebrity from '../../common/js/celebrity';
import { getCelebrity } from '../../api/celebrity';

// 2. 创建响应式数据
const celebrityDetail = ref({}); // 影人详情
const works = ref([]); // 代表作品列表
const scrollX = ref(true);
const eventPassthrough = ref('vertical');
const fullScreen = ref(true);
const showScore = ref(true);
const collectText = ref('收藏');
const isCollected = ref(false);
const celebrity = ref(null); // 影人对象

// 3. 创建引用
const fixedRef = ref(null);
const imageRef = ref(null);
const scrollRef = ref(null);
const contentRef = ref(null);
const infoRef = ref(null);

// 4. 创建路由和store实例
const router = useRouter();
const route = useRoute();
const store = useStore();

// 5. 计算属性
const collectClass = computed(() => {
  return isCollected.value === false ? 'icon-collect' : 'icon-checkmark';
});

// 从store中获取getter
const currentCelebrityId = computed(() => store.getters.currentCelebrityId);
const collectedCelebrities = computed(() => store.getters.collectedCelebrities);

// 6. 方法定义

// 返回上一页
const back = () => {
  router.back();
};

// 显示影人详细信息
const showInfo = () => {
  if (infoRef.value && infoRef.value.show) {
    infoRef.value.show();
  }
};

// 收藏/取消收藏影人
const saveCollect = () => {
  store.dispatch('markCelebrity', celebrity.value); // 提交actions
  isCollected.value = !isCollected.value;
  collectText.value = isCollected.value ? '已收藏' : '收藏';
};

// 查看全部作品
const getAllWorks = () => {
  router.push({
    path: `/celebrity/${currentCelebrityId.value}/works`
  });
};

// 选择作品
const selectWork = (movie) => {
  // 在Vue3中，event._constructed可能不再适用
  // 如果使用了自定义scroll组件，可能需要其他方式来区分事件
  store.commit('SET_MOVIE', movie);
  router.push({
    path: `/movie/${movie.id}`
  });
};

// 获取影人信息
const _getCelebrity = async () => {
  if (!currentCelebrityId.value) { // 当前页面浏览器刷新跳转回主页
    router.push('/movie-show');
    return;
  }

  try {
    const res = await getCelebrity(currentCelebrityId.value);

    if (!route.params.celebrityId) { // 防止快速切换报错
      return;
    }

    celebrityDetail.value = res;

    // 处理影人作品
    let ret = [];
    res.works?.forEach((item) => {
      ret.push(item.subject);
    });
    works.value = createMovieList(ret);

    _checkCollect(); // 检查是否已收藏

    // 创建影人对象
    const mainWorks = [];
    res.works?.forEach((item) => {
      mainWorks.push(item.subject.title);
    });
    celebrity.value = new Celebrity({
      id: res.id,
      name: res.name,
      image: res.avatars?.large,
      works: mainWorks.slice(0, 3).join('/')
    });

    await nextTick(); // 等待DOM更新
    _initPics();
  } catch (error) {
    console.error('获取影人信息失败:', error);
  }
};

// 图片URL处理（防盗链）
const replaceUrl = (srcUrl) => {
  if (srcUrl) {
    return 'https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, '');
  }
  return '';
};

// 检查是否已收藏
const _checkCollect = () => {
  const index = collectedCelebrities.value.findIndex((item) => {
    return item.id === celebrityDetail.value.id;
  });

  if (index > -1) {
    isCollected.value = true;
    collectText.value = '已收藏';
  } else {
    isCollected.value = false;
    collectText.value = '收藏';
  }
};

// 初始化图片宽度
const _initPics = async () => {
  let picWidth = 90;
  let margin = 8;
  let length = celebrityDetail.value.works?.length || 0;
  let width = (picWidth + margin) * length - margin;

  if (contentRef.value) {
    contentRef.value.style.width = width + 'px';
  }
};

// 7. 组件挂载后执行
onMounted(() => {
  _getCelebrity();
});
</script>

<style scoped>
.detail-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #333;
  z-index: 10;
}

.detail-wrapper .fixed-title {
  position: fixed;
  top: 0;
  width: 100%;
  height: 40px;
  z-index: 100;
  background-color: rgba(85, 85, 85, 0.6);
}

.detail-wrapper .fixed-title .back {
  position: absolute;
  top: 0px;
  left: 6px;
  z-index: 50;
}

.detail-wrapper .fixed-title .back .icon-back {
  display: block;
  padding: 11px;
  font-size: 18px;
  color: #f5f5f5;
}

.detail-wrapper .fixed-title .type {
  display: inline-block;
  padding-top: 12px;
  padding-left: 50px;
  font-size: 16px;
  color: #f5f5f5;
}

.detail-wrapper .celebrity-detail {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #333;
}

.detail-wrapper .celebrity-detail .bg-image {
  text-align: center;
  padding: 50px 0 20px 0;
  background-color: #333;
}

.detail-wrapper .celebrity-detail .bg-image img {
  width: 40%;
}

.detail-wrapper .celebrity-detail .celebrity-info {
  background-color: #f5f5f5;
  padding: 15px 20px 0 20px;
}

.detail-wrapper .celebrity-detail .celebrity-info .main {
  position: relative;
}

.detail-wrapper .celebrity-detail .celebrity-info .main .name-cn {
  font-size: 16px;
  color: #333;
}

.detail-wrapper .celebrity-detail .celebrity-info .main .name-en {
  display: inline-block;
  padding-top: 7px;
  font-size: 14px;
}

.detail-wrapper .celebrity-detail .celebrity-info .main .collect {
  position: absolute;
  top: 0;
  right: 0;
  height: 30px;
  line-height: 30px;
  width: 80px;
  text-align: center;
  font-size: 14px;
  border: 1px solid #ff4500;
  border-radius: 10px;
}

.detail-wrapper .celebrity-detail .celebrity-info .main .collect.has-collected {
  border: 1px solid #ff6b6b;
  color: #ff6b6b;
}

.detail-wrapper .celebrity-detail .celebrity-info .main .collect.has-collected .icon,
.detail-wrapper .celebrity-detail .celebrity-info .main .collect.has-collected .text {
  color: #ff6b6b;
}

.detail-wrapper .celebrity-detail .celebrity-info .main .collect .icon {
  display: inline-block;
  vertical-align: middle;
  color: #ff4500;
}

.detail-wrapper .celebrity-detail .celebrity-info .main .collect .text {
  display: inline-block;
  font-size: 12px;

  color: #ff4500;
}

.detail-wrapper .celebrity-detail .celebrity-info .brief {
  position: relative;
  margin-top: 30px;
  font-size: 14px;

}

.detail-wrapper .celebrity-detail .celebrity-info .brief .text {
  position: relative;
  padding-right: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 20px;
  color: #333;
  line-height: 20px;
}

.detail-wrapper .celebrity-detail .celebrity-info .brief .text .more {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  font-size: 20px;
  color: #ff4500;
}

.detail-wrapper .celebrity-detail .celebrity-info .works {
  margin-top: 30px;
  padding-bottom: 20px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  font-size: 0;
  position: relative;
}

.detail-wrapper .celebrity-detail .celebrity-info .works::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: #ccc;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}

.detail-wrapper .celebrity-detail .celebrity-info .works .works-content .title {
  font-size: 14px;
  padding-bottom: 20px;
}

.detail-wrapper .celebrity-detail .celebrity-info .works .works-content .work-item {
  width: 90px;
  vertical-align: top;
  display: inline-block;
  margin-right: 8px;
  font-size: 14px;
}

.detail-wrapper .celebrity-detail .celebrity-info .works .works-content .work-item img {
  height: 120px;
  width: 90px;
}

.detail-wrapper .celebrity-detail .celebrity-info .works .works-content .work-item .item-title {
  color: #333;
  padding: 8px 0 5px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.detail-wrapper .celebrity-detail .celebrity-info .allWorks {
  padding: 20px 0;
  font-size: 14px;

}

.detail-wrapper .celebrity-detail .celebrity-info .allWorks i {
  display: inline-block;
  vertical-align: middle;
  font-size: 20px;

}
</style>