import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'Home',
    component: () => import('../App'),
    path: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
