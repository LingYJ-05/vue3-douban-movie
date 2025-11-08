<template>
    <div class="search-box">
        <div class="search-input-container">
           <el-icon class="search-icon"><Search /></el-icon>
            <input @keyup.enter="handleSearch" type="text" class="box" :placeholder="placeholder" v-model="query" ref="inputRef">
        </div>
        <span class="cancel" @click="back">取消</span>
    </div>
</template>

<script setup name="SearchBox">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'


const query = ref('')
const placeholder = ref('搜索电影/影人')
// 添加 inputRef 来引用 input 元素
const inputRef = ref(null)
const router = useRouter()


// 点击取消返回首页
function back() {
    query.value = ''
    router.push('/')
}

// 处理搜索
const handleSearch = () => {
    if (query.value.trim()) {
        const searchQuery = query.value.trim()
        router.push({ name: 'search', query: { q: searchQuery } })
        query.value = ''
        
        // 确保inputRef已初始化再尝试聚焦
        if (inputRef.value) {
            // 使用setTimeout确保路由跳转完成后再聚焦
            setTimeout(() => {
                inputRef.value.focus()
            }, 100)
        }
    }
}

</script>

<style scoped>
/* 添加搜索框的样式 */
.search-box {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: #42bd56;
    border-bottom: 1px solid #eee;
}

.search-input-container {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 12px;
    color: #999;
    z-index: 1;
}

.search-box .box {
    width: 100%;
    height: 32px;
    padding: 0 10px 0 36px;
    border: 1px solid #eee;
    border-radius: 16px;
    outline: none;
}

.search-box .cancel {
    margin-left: 10px;
    color: #333;
    cursor: pointer;
}

</style>
