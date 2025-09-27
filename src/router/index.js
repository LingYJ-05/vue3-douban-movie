import { createRouter, createWebHashHistory } from 'vue-router'
import AllDiscussion from '../components/all-discussion/all-discussion.vue'
import MovieReview from '../components/movie-review/movie-review.vue'

// 定义路由配置
const routes = [
  {
    path: '/',
    redirect: '/movie-show' // 重定向到热映页面
  },
  {
    path: '/movie-show',
    name: 'movie-show',
    component: () => import('../components/movie-show/movie-show.vue')
  },
  {
    path: '/rank',
    name: 'rank',
    component: () => import('../components/rank/rank.vue'),
    children: [
      {
        path: ':rankType',
        name: 'rank-detail',
        component: () => import('../components/rank-detail/rank-detail.vue')
      }
    ]
  },
  {
    path: '/user-center',
    name: 'user-center',
    component: () => import('../components/user-center/user-center.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../components/search/search.vue')
  },
  {
    path: '/movie-detail/:id',
    name: 'movie-detail',
    component: () => import('../components/movie-detail/movie-detail.vue'),
    children: [
      {        path: 'reviews',        name: 'movie-detail-reviews',        component: MovieReview      },
      {
        path:'discussType',
        component:AllDiscussion
      }
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
