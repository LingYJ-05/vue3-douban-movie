<template>
    <div class="rank-list">
        <ul>
            <li class="rank-item" v-for="(item, index) in rankItems" :key="index" @click.stop="selectItem(item, $event)"
                :class="{ compact: !needRank }">
                <div class="rank-rating" v-show="needRank">
                    <div class="line"></div>
                    <span class="text">{{ page * 50 + index + 1 }}</span>
                </div>
                <div class="rank-info" :class="{ 'compact': !needRank }">
                    <div class="info-img">
                        <img :src="replaceUrl(item.images)" height="100" width="70" alt="" />
                    </div>
                    <div class="info-desc">
                        <p class="title">{{ item.title }}</p>
                        <Star :size="24" :score="item.rating" :showScore="showScore" />
                        <div class="director">导演：{{ item.directors && item.directors[0] ? item.directors[0].name : '未知' }}</div>
                        <div class="casts">主演：{{ item.casts && item.casts.length > 0 ? item.casts.slice(0, 2).map(item => item.name).join('/') : '未知' }}</div>
                    </div>
                </div>
            </li>
        </ul>
        <LoadMore :hasMore="hasMore" v-show="rankItems.length && needLoading" />
        <div class="rank-rating"></div>
    </div>
</template>


<script setup name="RankList">
//导入子组件
import { ref } from 'vue'
import Star from '../../base/star/star.vue'
import LoadMore from '../../base/loadmore/loadmore.vue'

const props = defineProps({
    rankItems: {
        type: Array,
        default: () => []
    },
    hasMore: {
        type: Boolean,
        default: false
    },
    needLoading: {
        type: Boolean,
        default: true
    },
    needRank: {
        type: Boolean,
        default: true
    },
    page: {
        type: Number,
        default: 0
    }
})
//定义emit 向父组件发送select事件
const emit = defineEmits(['select'])

//响应式数据
const showScore = ref(true)

//方法
const selectItem = (movie, e) => {
    //忽略点击事件
    if (!e) {
        return
    }
    //向父组件发送 select事件 传递选中的电影数据
    emit('select', movie)
}
//图片防盗链
const replaceUrl = (srcUrl) => {
    if (!srcUrl || typeof srcUrl === 'undefined') {
        return ''
    }
    // 如果srcUrl已经是完整的图片对象，取large属性
    if (typeof srcUrl === 'object' && srcUrl.large) {
        return 'https://images.weserv.nl/?url=' + srcUrl.large.replace(/http\w{0,1}:\/\//, '')
    }
    // 如果srcUrl是字符串，直接处理
    return 'https://images.weserv.nl/?url=' + srcUrl.replace(/http\w{0,1}:\/\//, '')
}

</script>
<style scoped>
.rank-item {
    padding-top: 30px;
}

.rank-item.compact {
    padding-top: 0px;
}

.rank-rating {
    position: relative;
    margin: 30px auto;
    text-align: center;
    height: 10px;
    width: 50%;
}

.rank-rating .line {
    border-bottom: 1px solid #ccc;
}

.rank-rating .text {
    padding: 0 10px;
    display: inline-block;
    background-color: #fff;
    /* $color-background */
    position: absolute;
    left: 50%;
    top: -8px;
    transform: translateX(-50%);
    font-size: 16px;
    /* $font-size-large */
    color: #ff4d4d;
    /* $color-theme-f */
}

.rank-info {
    display: flex;
    align-items: top;
    box-sizing: border-box;
    height: 130px;
    padding: 15px;
    border: 1px solid #e0e0e0;
    /* $color-line */
}

.rank-info.compact {
    border: 0;
    border-bottom: 1px solid #e0e0e0;
    /* $color-line */
}

.info-img {
    flex: 0 0 70px;
    margin-right: 10px;
}

.info-desc {
    flex: 1;
    box-sizing: border-box;
    height: 100px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
}

.info-desc .title {
    font-size: 16px;
    /* $font-size-medium-x */
    color: #333;
    /* $color-text-f */
    margin: 0;
}

.info-desc .director {
    font-size: 14px;
    /* $font-size-small */
}

.info-desc .casts {
    font-size: 14px;
    /* $font-size-small */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.rank-item:last-child {
    margin-bottom: 30px;
}
</style>