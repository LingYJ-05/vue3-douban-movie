// src/store/modules/rank.ts
import { defineStore } from 'pinia'

// 定义状态接口
interface RankState {
  showCards: boolean;
}

// 创建并导出Pinia store
export const useRankStore = defineStore('rank', {
  state: (): RankState => ({
    showCards: true, // 默认显示卡片
  }),
  actions: {
    updateShowCards(show: boolean) {
      this.showCards = show;
    },
  },
  getters: {
    getShowCards(): boolean {
      return this.showCards;
    },
  }
})