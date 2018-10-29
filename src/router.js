import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Default',
      component: () => import(/* webpackChunkName: "default" */ './views/Default.vue'),
      children: [
        {
          path: '/collections',
          name: 'Collections',
          component: () => import(/* webpackChunkName: "collections" */ './views/Collections.vue'),
          props: true
        },
        {
          path: '/docs/reference/:collection',
          name: 'ApiDoc',
          component: () => import(/* webpackChunkName: "apidoc" */ './views/ApiDoc.vue')
        }
      ],
      beforeEnter: (to, from, next) => {
        if (!localStorage.user || !localStorage.token) {
          next({path: '/login'})
        }
        else {
          next()
        }
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    }
  ]
})
