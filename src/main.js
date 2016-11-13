import Vue from 'vue'
import Firebase from 'firebase'
import VueFire from 'vuefire'
import VueRouter from 'vue-router'
import routes from './routes'

Vue.use(VueFire)
Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

new Vue({
  router
}).$mount('#app')
