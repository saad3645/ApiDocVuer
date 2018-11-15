import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {MdApp, MdButton, MdCard, MdContent, MdDivider, MdDrawer, MdField, MdIcon, MdList, MdMenu, MdProgress, MdRipple, MdSnackbar, MdTable, MdTabs, MdToolbar, MdTooltip} from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(MdApp)
Vue.use(MdButton)
Vue.use(MdCard)
Vue.use(MdContent)
Vue.use(MdDivider)
Vue.use(MdDrawer)
Vue.use(MdField)
Vue.use(MdIcon)
Vue.use(MdList)
Vue.use(MdMenu)
Vue.use(MdProgress)
Vue.use(MdRipple)
Vue.use(MdSnackbar)
Vue.use(MdTable)
Vue.use(MdTabs)
Vue.use(MdToolbar)
Vue.use(MdTooltip)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
