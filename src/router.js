import VueRouter from 'vue-router'
import App from './components/App.vue'
import Login from './components/Login.vue'
import List from './components/List.vue'
import Home from './components/Home.vue'
import PickedUp from './components/PickedUp.vue'
import Detail from './components/Detail.vue'
import New from './components/New.vue'

// how to have historical and default ('home'  / 'list') share composition but
// feel like separate pages/views?

/**
 *
 *

   /users
   /users/:id
   /signup
   /post

   <!--

   Router View

   /coasters   ... OR ... /
     uses list component

   /coasters/:id
     coaster component
   /picked-up
     - list
     - links to detail views that use coaster component
     - filter options: (default) picked up only
   /users
     modified list component?
   /users/:id
     need user component

   /signup

 -->

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
