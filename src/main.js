import Vue from 'vue'
import Firebase from 'firebase'
import VueFire from 'vuefire'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import router from './router'

Vue.use(VueFire)
Vue.use(VueRouter)
Vue.use(Vuex)

new Vue({
  router
}).$mount('#app')
