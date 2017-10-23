import VueRouter from 'vue-router'
import App from './components/App.vue'
import store from './store'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import PickedUp from './components/PickedUp.vue'
import Post from './components/Post.vue'
import Detail from './components/Detail.vue'
import User from './components/User/User.vue'


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
        name: 'pickedUp',
        path: '/picked-up',
        component: PickedUp
      },
      {
        path: '/login',
        component: Login
      },
      {
        name: 'user',
        path: '/user/:uid',
        component: User
        ,
        beforeEnter: (to, from, next) => {
          store.dispatch('getUserPostedAndHoldingShifts', to.params.uid).then((userData) => {
            next()
          })
        }
      },
      {
        name: 'post',
        path: '/post',
        component: Post
      },
      {
        name: 'detail',
        path: 'coasters/:id',
        component: Detail,
        beforeEnter: (to, from, next) => {
          store.dispatch('getPromisedDetailCoaster', to.params.id).then(() => next())
        }
      }

    ]
 }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  let promised = [
    store.dispatch('getPromisedCoasters')
  ] // this can be added to
  Promise.all(promised).then(() => {
    next()
  })

  // TODO: handle failure, show loading component

  // store.dispatch('getPromisedCoasters').then(() => next())


})

export default router
