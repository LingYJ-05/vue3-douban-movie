import { createStore } from 'vuex'
import state from './state';
import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

// 开发环境下开启严格模式
const debug = process.env.NODE_ENV !== 'production';

// 创建并导出Vuex store实例
const store = createStore({
  actions,
  getters,
  state,
  mutations,
  strict: debug,
  // 在Vue 3中，logger插件需要调整，这里暂时移除
  plugins: []
});

export default store;