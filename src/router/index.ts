import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/page/layout/index.vue'),
      children: [
        {
          path: '/',
          name: 'AboutView',
          component: () => import('@/views/AboutView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/page/login/index.vue')
    }
  ]
})

router.beforeEach((to) => {
  if (to.path === '/login') return true
  return '/login'
})

export default router
