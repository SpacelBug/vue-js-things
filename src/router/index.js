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
  },
  {
    name: 'themes',
    component: () => import('../views/themes/ThemeView'),
    path: '/themes'
  },
  {
    name: 'components',
    component: () => import('../views/components/ComponentsView'),
    path: '/components',
    children: [
      {
        name: 'simple-components',
        component: () => import('../views/components/SimpleComponents'),
        path: 'simple-components'
      },
      {
        name: 'other-components',
        component: () => import('../views/components/OtherComponents'),
        path: 'other-components'
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
