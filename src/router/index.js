import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'graphs',
    component: () => import('../views/GraphsView'),
    path: '/graphs'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
