<template>
  <div id="my-app">
    <navigation></navigation>
    <!--

    Router View

    /coasters
    /coasters/:id
    /users
    /users/:id
    /signup
    
  -->
    <router-view :coasters="currentList" :myProps="routerViewProps"></router-view>
  </div>
</template>

<script>
import _ from 'underscore'
//
// views can listen to firebase independently
// but beyond straight up data bindings, they're also listening for app wide events
//
// auth state lives in the app component
// as do current notifications


// everyone should probably have
//
import bus from '../bus'
import actions from '../actions/actions'

// all components
//
import router from '../router'
import Navigation from './Navigation.vue'
import firebase from '../firebase'
import mixins from '../mixins'

// not sure
//
import auth from '../auth'

// module tests
//
// auth.helloFromAuth()
// actions.helloFromActions()
// actions.secondHandAuthHi()
// actions.secondHandShiftHi()

const db = firebase.database()
const coastersRef = db.ref('data/coasters')

// fb helper
function fbRefFromChild(child, equalTo) {
  return coastersRef.orderByChild(child).equalTo(equalTo)
}

// these are shift actions
function removeCoaster(arbitraryRef, key) {
  arbitraryRef.child(key).remove()
}
function newCoaster(coaster) {
  if (!coaster) return
  let decoratedCoaster = Object.assign({pickedUp: true}, coaster)
  coastersRef.push(decoratedCoaster)
}


function attachListeners(vm) {


  bus.$on('remove-coaster', (coaster) => {
    removeCoaster(coastersRef, coaster['.key'])
  })
  bus.$on('new-coaster', (coasterData) => {
    newCoaster(coasterData)
  })
  bus.$on('msg', (event) => {
    switch (event.type) {
      case bus.SIGN_IN:
        handleLoginEvent(event)
        break;
      case bus.LOG_OUT_USER:
        handleLogOutUserEvent()
        break;
      case bus.MAKE_DETAIL:
        vm.detailKey = event.payload['.key']
        router.push({
          name: 'detail',
          params: { key: event.payload['.key']}
        })
        break;
      case bus.CLOSE_DETAIL:
        router.push({ path: '/' })
        break;
      case bus.CHANGE_LIST:
        console.log('change list, please')
        vm.$bindAsArray('pickedUp', fbRefFromChild('pickedUp', true))
        vm.currentList = vm.pickedUp
        break;
      default:
        console.log("An indeterminate message was emitted");
    }
  })
}

export default {
  firebase: {
    coasters: coastersRef.orderByChild('date').startAt('2016-01-02')
    // notPickedUp: coastersRef.orderByChild('pickedUp').equalTo(false)
  },
  components: {
    Navigation
  },
  created () {

    // Super temp
    //
    attachListeners(this)
    if (this.$route.path === '/history') {
      console.log("created with route.path === '/history'")
      this.$bindAsArray('oldCoasters', coastersRef.orderByChild('date').endAt('2016-01-01'))
      this.currentList = this.oldCoasters
    } else {
      console.log("created with route.path === '/'")
    }
    // this.$bindAsArray('currentCoasters', coastersRef.orderByChild('date').startAt('2016-01-12'))
    // this.currentList = this.currentCoasters
  },
  data: function () {
    return {
      detailKey: null,
      currentList: this.coasters,
      // we can organize all props than need to be passed to <router-view> components
      authState: {
        status: 'NOT_LOGGED_IN',
        user: null
      },
      // routerViewProps: {
      // },
      bar: 'bar'
    }
  },
  watch: {
    '$route' (to, from) {
      // this can be any
      if (to.path === '/history') {
        console.log("route change and route.path === '/history'")
        this.$bindAsArray('oldCoasters', coastersRef.orderByChild('date').endAt('2016-01-01'))
        this.currentList = this.oldCoasters
      } else if (to.path === '/') {
        console.log("route change and route.path === '/'")
        this.currentList = this.coasters
      }
    }
  },
  computed: {

    foo () {
      return this.bar
    },

    routerViewProps () {
      return {
        authState: this.authState
      }
    }

    // detail () {
    //
    //   let getCoasterByKey = (key) => {
    //     let obj = {}
    //     obj['.key'] = key
    //     return _.where(this.coasters, obj)[0]
    //   }
    //
    //   return getCoasterByKey(this.detailKey)
    // }
  },
  methods: {

  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
ul {
  list-style-type: none;
}
.dynamic-container {
    height: 17em;
}
img.close {
  max-width: 1em;
  float: right;
}
</style>
