import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'graphs',
    component: () => import('../views/GraphsView'),
    path: '/graphs'
  },
  {
    name: 'animations',
    component: () => import('../views/animations/AnimationsView'),
    path: '/animations'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
