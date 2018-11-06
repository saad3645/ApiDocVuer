import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const authenticate = function(to, from, next) {
  if (!localStorage.user || !localStorage.token || !localStorage.token_expires_at || Math.ceil(Date.now() / 1000) >= localStorage.token_expires_at) {
    next({path: '/login'})
  }
  else if (to.name === 'Default') {
    next({path: '/apps'})
  }
  else if (to.name === 'NoMatch') {
    next({path: '/apps'})
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
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '/apps',
      component: () => import(/* webpackChunkName: "apps_root" */ './components/MainLayout.vue'),
      beforeEnter: authenticate,
      children: [
        {
          path: '',
          name: 'Apps',
          component: () => import(/* webpackChunkName: "apps" */ './views/Apps/Index.vue'),
          beforeEnter: authenticate
        },
        {
          path: ':appId/docs',
          name: 'AppDocs',
          component: () => import(/* webpackChunkName: "docs" */ './views/Apps/Docs.vue'),
          beforeEnter: authenticate
        }
      ]
    },
    {
      path: '/docs',
      component: () => import(/* webpackChunkName: "docs_root" */ './components/MainLayout.vue'),
      beforeEnter: authenticate,
      children: [
        {
          path: ':appId/:docId/:version/overview',
          name: 'Overview',
          component: () => import(/* webpackChunkName: "doc_overview" */ './views/Docs/Overview.vue')
        },
        {
          path: ':appId/:docId/:version/reference',
          name: 'Reference',
          component: () => import(/* webpackChunkName: "doc_reference" */ './views/Docs/Reference.vue')
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
    },
    {
      path: '/',
      name: 'Default',
      component: () => import(/* webpackChunkName: "default" */ './views/Default.vue'),
      beforeEnter: authenticate
    },
    {
      path: '/:foo+',
      name: 'NoMatch',
      component: () => import(/* webpackChunkName: "nomatch" */ './views/Default.vue'),
      beforeEnter: authenticate
    }
  ]
})
