<template>
    <ul class="switches" :class="{ 'small-font': smallFont }">
        <li v-for="(item, index) in items" :key="index" class="switches-item"
            :class="{ 'active': index === currentIndex }" @click="handleClick(index)">
            <span>{{ item.name }}</span>
        </li>
    </ul>
</template>

<script setup name="switches">
import { defineEmits } from 'vue'
const emit = defineEmits(['switch'])

const props = defineProps({
    items: {
        type: Array,
        default: () => []
    },
    smallFont: {
        type: Boolean,
        default: false
    },
    currentIndex: {
        type: Number,
        default: 0
    }
})

const handleClick = (index) => {
    emit('switch', index)
}
</script>

<style scoped>
.switches {
    position: relative;
    z-index: 200;
    background-color: #fff;
    display: flex;
    align-items: center;
    width: 100%;
    list-style: none;
    margin: 0;
    padding: 0;
}

.switches-item {
    flex: 1;
    text-align: center;
    padding: 15px;
    font-size: 16px;
    color: #777;
    border-bottom: 1px solid transparent;
    list-style: none;

    &.small-font {
        padding: 14px 5px;
        font-size: 14px;
    }

    &.active {
        color: #42bd56;
        border-bottom: 2px solid #42bd56;
        font-weight: 500;
    }
}

/* 确保没有其他样式影响导致出现圆点 */
.switches-item::before,
.switches-item::after {
    content: none !important;
}

.switches::before,
.switches::after {
    content: none !important;
}
</style>