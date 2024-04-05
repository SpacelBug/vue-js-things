import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: 'graphs',
    component: () => import('../views/GraphsView'),
    path: '/graphs'
  },
  {
    name: 'components',
    component: () => import('../views/ComponentsView'),
    path: '/components'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
