// 创建 Vuex store
import { createStore } from 'vuex';
import rankModule from './modules/rank'; // 导入 rank 模块

const store = createStore({
  modules: {
    rank: rankModule,
    // 可以在这里添加其他模块
  },
});

export default store;