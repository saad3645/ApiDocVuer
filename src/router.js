import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const authenticate = function(to, from, next) {
  if (!localStorage.user || !localStorage.token) {
    next({path: '/login'})
  }
  else if (to.name === 'Default') {
    next({path: '/docs'})
  }
  else {
    next()
  }
}

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Default',
      component: () => import(/* webpackChunkName: "default" */ './views/Default.vue'),
      beforeEnter: authenticate
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/docs',
      component: () => import(/* webpackChunkName: "apidocsroot" */ './views/Docs/Root.vue'),
      beforeEnter: authenticate,
      children: [
        {
          path: '',
          name: 'Docs',
          component: () => import(/* webpackChunkName: "apidocs" */ './views/Docs/Index.vue'),
          beforeEnter: authenticate
        },
        {
          path: ':apidoc/collections',
          name: 'Collections',
          component: () => import(/* webpackChunkName: "collections" */ './views/Docs/Collections.vue')
        },
        {
          path: ':apidoc/reference/:collection',
          name: 'Reference',
          component: () => import(/* webpackChunkName: "reference" */ './views/Docs/Reference.vue')
        }
      ]
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
