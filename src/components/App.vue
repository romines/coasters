<template>
  <div id="my-app" class="container">
    <modal :myProps="modalProps"></modal>
    <navigation :myProps="navProps" ></navigation>
    <!--

    Router View

    /coasters
    /coasters/:id
    /changes
    /changes/:id
    /users
    /users/:id
    /signup

  -->
    <section class="section">
      <router-view :coasters="currentList" :myProps="routerViewProps"></router-view>
    </section>
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
import Modal from './shared/Modal.vue'
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

// anything that works out here can be moved to modules/helpers

// these are shift actions
function removeCoaster(arbitraryRef, key) {
  arbitraryRef.child(key).remove()
}
function newCoaster(coaster) {
  if (!coaster) return
  let decoratedCoaster = Object.assign({pickedUp: true}, coaster)
  coastersRef.push(decoratedCoaster)
}

function showModal(vm, e) {
  vm.modal.show = true;
}
function closeModal(vm, e) {
  vm.modal.show = false;
}


function attachListeners(vm) {

  // TODO: We want to get event 'routing' out of App component while still updating
  // app state appropriately on global events. By passing in the viewmodel, this
  // can all be moved to a module! But it must have access to all the methods it
  // references

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
      case bus.SHOW_MODAL:
        showModal(vm, event)
        break;
      case bus.CLOSE_MODAL:
        closeModal(vm, event)
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
    Navigation,
    Modal
  },
  created () {
    // this.navProps.navState = { home: true, history: false, post: false }

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
      modal: {
        show: false,
        noties: []
      },
      detailKey: null,
      currentList: this.coasters,
      // we can organize all props than need to be passed to <router-view> components
      authState: {
        status: 'NOT_LOGGED_IN',
        user: null
      },
      navProps: {
        navState: {
          home: true,
          history: false,
          post: false,
        }
      }
    }
  },
  watch: {
    '$route' (to, from) {
      // this can be any
      let resetNav = () => { this.navProps.navState = { home: false, history: false, post: false } }

      if (to.path === '/history') {
        resetNav()
        console.log("route change and route.path === '/history'")
        this.$bindAsArray('oldCoasters', coastersRef.orderByChild('date').endAt('2016-01-01'))
        this.currentList = this.oldCoasters
        this.navProps.history = true;
      } else if (to.path === '/') {
        resetNav()
        console.log("route change and route.path === '/'")
        this.currentList = this.coasters
        this.navProps.home = true;
      } else {
        resetNav()
        this.navProps.post = true;
      }
    }
  },
  computed: {

    routerViewProps () {
      return {
        authState: this.authState
      }
    },
    modalProps () {
      console.log(this.modal);
      return this.modal
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
  /*font-family: Helvetica, sans-serif;*/
}
ul {
  list-style-type: none;
}

img.close {
  max-width: 1em;
  float: right;
}
</style>
