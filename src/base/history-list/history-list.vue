<template>
    <div class="history-list">
        <ul>
            <li :key="item" @click="selectItem(item)" class="history-item" v-for="item in searches">
                <span class="text">{{ item }}</span>
                <span class="close" @click.stop="deleteOne(item)">
                    <el-icon><Delete /></el-icon>
                </span>
            </li>
        </ul>
        <div class="no-history" v-show="!searches.length">还没有搜索历史 快去搜索吧 :)</div>
    </div>
</template>

<script setup name="history-list">
import { ref } from 'vue'
import { Delete } from '@element-plus/icons-vue'

// 定义 emits 事件
const emit = defineEmits(['selected', 'delete'])

// 定义 props 接收 searches
const props = defineProps({
    searches: {
        type: Array,
        default: () => []
    }
})

function selectItem(item) {
    emit('selected', item)
}

function deleteOne(item) {
    emit('delete', item)
}
</script>

<style scoped>
.history-list {
    padding: 10px 0;
    width: 100%; /* 确保组件占满父容器宽度 */
}

.history-list ul {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
}

.history-item {
    display: flex;
    align-items: center;
    justify-content: space-between; /* 确保文本在左，图标在右 */
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    width: 100%;
}

.text {
    flex: 1; /* 文本部分占据剩余空间 */
    font-size: 16px;
    color: #666;
}

.close {
    cursor: pointer;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 30px; /* 确保图标有足够的空间 */
}

.close :deep(.el-icon) {
    font-size: 16px;
    color: #42bd56;
}

.close :deep(.el-icon:hover) {
    color: #e74c3c;
}

.no-history {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    color: #999;
    margin-top: 10px;
}
</style>