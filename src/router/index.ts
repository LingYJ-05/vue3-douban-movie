import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/movie-show'
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
        path: '',
        name: 'rank-default',
        redirect: { name: 'top250' }
      },
      {
        path: 'top250',
        name: 'top250',
        component: () => import('../components/rank-detail/rank-detail.vue')
      },
      {
        path: 'weekly',
        name: 'weekly',
        component: () => import('../components/rank-detail/rank-detail.vue')
      },
      {
        path: 'new',
        name: 'new',
        component: () => import('../components/rank-detail/rank-detail.vue')
      },
      {
        path: 'us',
        name: 'us',
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
      {
        path: 'reviews',
        name: 'movie-detail-reviews',
        component: () => import('../components/movie-review/movie-review.vue')
      },
      {
        path: 'discussType',
        name: 'all-discussion',
        component: () => import('../components/all-discussion/all-discussion.vue')
      },
      {
        path: '',
        name: 'movie-detail-default',
        redirect: { name: 'movie-detail-reviews' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router