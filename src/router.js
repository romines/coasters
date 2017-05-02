import VueRouter from 'vue-router'
import App from './components/App.vue'
import store from './store'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import PickedUp from './components/PickedUp.vue'
import Detail from './components/Detail.vue'
import User from './components/User/User.vue'
import New from './components/New.vue'


/**
 *
 * TODO:

 /users - list of users

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
        component: User,
        beforeEnter: (to, from, next) => {
          store.dispatch('getPromisedUserData', to.params.key)
          setTimeout(() => next(), 100)
        }
      },
      {
        path: '/new',
        component: New
      },
      {
        name: 'detail',
        path: 'coasters/:id',
        component: Detail
      }

    ]
 }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  store.dispatch('getPromisedCoasters').then(next())

  // if (store.state.coasters.length) {
  //   next()
  // } else {
  //   store.dispatch('getPromisedCoasters').then(next())
  // }

})

export default router
