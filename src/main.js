import Vue from 'vue'
import Firebase from 'firebase'
import VueFire from 'vuefire'
import VueRouter from 'vue-router'
import App from './components/App.vue'

Vue.use(VueFire)
Vue.use(VueRouter)
const Bar = { template: '<div>the bar is: {{ $route.params.id }}</div>' }

const routes = [
  { path: '/coasters', component: App, alias: '/' },
  { path: '/bar/:id', component: Bar }
]

const router = new VueRouter({
  routes // short for routes: routes
})

new Vue({
  router
}).$mount('#app')
