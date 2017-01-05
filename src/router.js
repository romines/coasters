import VueRouter from 'vue-router'
import App from './components/App.vue'
import Login from './components/Login.vue'
import List from './components/List.vue'
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
   /history
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
  { path: '/coasters', component: App, alias: '/',
    children: [
      {
        name: 'home',
        path: '',
        component: List // List should be child of a 'Home' component
      },
      {
        path: '/history',
        component: List,
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
        path: '/:id',
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
