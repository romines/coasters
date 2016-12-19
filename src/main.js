import Vue from 'vue'
import Firebase from 'firebase'
import VueFire from 'vuefire'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import router from './router'

Vue.use(VueFire)
Vue.use(VueRouter)
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
  	increment: state => state.count++,
    decrement: state => state.count--
  }
})

new Vue({
  router,
  store
}).$mount('#app')
