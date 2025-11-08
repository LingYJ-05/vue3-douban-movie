<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ArrowLeft, Film } from '@element-plus/icons-vue'
// 导入您的 API 文件 - 使用具名导入
import { top250Rank, weeklyRank, newMoviesRank, usRank } from '@/api/movie-rank'

const route = useRoute()
const router = useRouter()
const store = useStore()

// ... 其余代码保持不变 ...

// 根据路径确定榜单类型和对应的 API 函数
const apiMap = {
  top250: top250Rank,
  weekly: weeklyRank,
  new: newMoviesRank,
  us: usRank,
}
</script>