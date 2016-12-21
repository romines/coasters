import Vue from 'vue'
import Firebase from 'firebase'
import VueFire from 'vuefire'
import VueRouter from 'vue-router'

import store from './store'
import router from './router'

Vue.use(VueFire)
Vue.use(VueRouter)


new Vue({
  router,
  store
}).$mount('#app')
