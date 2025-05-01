import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component:()=>import('../views/Home.vue')
    },
    {
      path: '/Home',
      component:()=>import('../views/Home.vue')
    },
    {
      path: '/Article',
      component:()=>import('../views/Article.vue')
    },
    {
      path: '/Picture',
      component:()=>import('../views/Picture.vue')
    }
  ]
})

export default router
