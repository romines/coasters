import VueRouter from 'vue-router'
import App from './components/App.vue'
import Login from './components/Login.vue'
import List from './components/List.vue'
import Home from './components/Home.vue'
import PickedUp from './components/PickedUp.vue'
import Detail from './components/Detail.vue'
import User from './components/User/User.vue'
import New from './components/New.vue'

// how to have historical and default ('home'  / 'list') share composition but
// feel like separate pages/views?

/**
 *
 * TODO:

 /users
   modified list component?
 /users/:id
   need user component

 *
 */

const routes = [
  { path: '/', component: App,
    children: [
      {
        name: 'home',
        path: '',
        component: Home
      },
      {
        path: '/picked-up',
        component: PickedUp,
        meta: {
          sort: 'historical'
        }
      },
      {
        path: '/login',
        component: Login
      },
      {
        path: '/user/:key',
        name: 'user',
        component: User
      },
      {
        path: '/new',
        component: New
      },
      {  // move to /coaster/:key
        name: 'detail',
        path: 'coasters/:id',
        component: Detail
      }
      // {  // move to /coaster/:key
      //   name: 'detail',
      //   path: '/detail/:key',
      //   component: Detail
      // },
    ]
 }
]

export default new VueRouter({
  routes
})
