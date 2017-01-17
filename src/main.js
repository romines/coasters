import Vue from 'vue'
import VueRouter from 'vue-router'

import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'

sync(store, router)

Vue.use(VueRouter)


new Vue({
  router,
  store
}).$mount('#app')
