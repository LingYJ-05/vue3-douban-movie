<template>
    <!-- 利用默认插槽实现内容滚动 -->
    <div class="wrapper">
        <slot></slot>
    </div>
</template>


<script setup name="scroll">
import BScroll from 'better-scroll';
import { ref, onMounted, nextTick, defineExpose } from 'vue';

const props = defineProps({
    click: {      //是否支持点击
        type: Boolean,
        default: true
    },
    probeType: {  //滚动事件类型
        type: Number,
        default: 1
    },
    scrollX: {   //是否支持水平滚动
        type: Boolean,
        default: false
    },
    scrollY: {  //是否支持垂直滚动
        type: Boolean,
        default: true
    },
    listenScroll: {  //是否监听滚动事件
        type: Boolean,
        default: false
    },
    pullup: {   //是否支持上拉加载
        type: Boolean,
        default: false
    },
    beforeScroll: {  //滚动前是否执行回调
        type: Boolean,
        default: false
    },
    eventPassthrough: {  //是否支持事件穿透
        type: Boolean,
        default: false
    },
})
const wrapper = ref(null);
const scroll = ref(null);
const emit = defineEmits(['scroll', 'beforeScroll', 'scrollEnd']);

const initScroll = () => {
    if (!wrapper.value) return
    scroll.value = new BScroll(wrapper.value, {
        click: props.click,
        probeType: props.probeType,
        scrollX: props.scrollX,
        scrollY: props.scrollY,
        pullUpLoad: props.pullup,
    })
    
    // 添加滚动事件监听
    if (props.listenScroll && scroll.value) {
        scroll.value.on('scroll', (pos) => {
            emit('scroll', { detail: pos });
        });
    }
    
    // 添加滚动开始事件监听（模拟beforeScroll）
    if (props.beforeScroll && scroll.value) {
        scroll.value.on('scrollStart', () => {
            emit('beforeScroll');
        });
    }
    
    // 添加滚动结束事件监听
    if (scroll.value) {
        scroll.value.on('scrollEnd', () => {
            emit('scrollEnd');
        });
    }
    
    // 添加上拉加载事件监听
    if (props.pullup && scroll.value) {
        scroll.value.on('pullingUp', () => {
            emit('pullingUp');
        });
    }
}

// 刷新滚动组件
const refresh = () => {
    if (scroll.value) {
        scroll.value.refresh();
    }
}

//等待dom更新完毕
onMounted(async () => {
    await nextTick()
    initScroll()
})

// 导出方法供父组件使用
defineExpose({
    refresh,
    scroll
})

</script>

<style scoped></style>
