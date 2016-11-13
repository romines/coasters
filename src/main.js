import Vue from 'vue'
import Firebase from 'firebase'
import VueFire from 'vuefire'
import VueRouter from 'vue-router'
import App from './components/App.vue'
import New from './components/New.vue'
import List from './components/List.vue'

Vue.use(VueFire)
Vue.use(VueRouter)
const Bar = { template: '<div>the bar is: {{ $route.params.id }}</div>' }
const Test = { template: '<h3>this is the test child route</h3>' }

const routes = [
  { path: '/coasters', component: App, //, alias: '/'
    children: [
      {
        path: '',
        component: List
      },
      {
        path: '/test',
        component: Test
      },
      {
        path: '/new',
        component: New
      }
    ]
 },
  { path: '/bar/:id', component: Bar }
]

const router = new VueRouter({
  routes // short for routes: routes
})

new Vue({
  router
}).$mount('#app')
