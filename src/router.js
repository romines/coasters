import VueRouter from 'vue-router'
import App from './components/App.vue'
import Login from './components/Login.vue'
import List from './components/List.vue'
import Detail from './components/Detail.vue'
import New from './components/New.vue'

const Test = { template: '<h3>this is the test child route</h3>' }
const Bar = { template: '<div>the bar is: {{ $route.params.id }}</div>' }

const routes = [
  { path: '/coasters', component: App, alias: '/',
    children: [
      {
        path: '',
        component: List
      },
      {
        path: '/login',
        component: Login
      },
      {
        path: '/post',
        component: New
      },
      {
        name: 'detail',
        path: '/detail/:key',
        component: Detail
      },
    ]
 },
  { path: '/bar/:id', component: Bar }
]

export default new VueRouter({
  routes
})
