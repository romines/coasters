<template>
  <div id="my-app" class="container">

    <modal :myProps="modalProps"></modal>
    <navigation :myProps="navProps" ></navigation>
    <div class="make-local">
      <section class="section">
        <h3>count: {{count}}</h3>
        <h3>hundreds: {{hundreds}}</h3>
        <button class="button" @click="increment">+</button>
        <button class="button" @click="decrement">-</button>
        <button class="button" @click="incrementAsync">increment eventually</button>
        <br>
        <br>
        <br>
        <button class="button" @click="makeLocal">Local</button>
        <button class="button" @click="makeFirebase">Firebase</button>
      </section>
    </div>
    <section class="section">
      <router-view :coasters="currentList" :myProps="routerViewProps"></router-view>
    </section>

  </div>
</template>

<script>

// everyone should probably have
//
import _ from 'underscore'
import moment from 'moment'
import bus from '../bus'

// all components should probably have
//
import router from '../router'
import Navigation from './Navigation.vue'
import Modal from './widgets/Modal.vue'

import { firebase } from '../libs'
import mixins from '../mixins'

// not sure
//
import auth from '../auth'

import { fbRefFromChild } from '../helpers'




// components might establish their own ref
// this is essentially read only
// any actions relating to data must go through bus/actions

const db = firebase.database()
const coastersRef = db.ref('data/coasters')



// anything that works out here can be moved to modules/helpers

// these are shift actions
function removeCoaster(arbitraryRef, key) {
  arbitraryRef.child(key).remove()
}
function newCoaster(coaster) {
  if (!coaster) return
  let decoratedCoaster = Object.assign({pickedUp: true}, coaster)
  console.log(decoratedCoaster);
  // coastersRef.push(decoratedCoaster)
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
        auth.handleLoginEvent(event)
        break;
      case bus.LOG_OUT_USER:
        handleLogOutUserEvent()
        break;
      case bus.AUTH_STATE_CHANGE:
        vm.handleAuthStateChange(event)
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
      list: 'offLine',
      modal: {
        show: false,
        noties: [
          {
            foo: 'this is a notification'
          }
        ]
      },
      detailKey: null,
      // we can organize all props than need to be passed to <router-view> components
      authState: {
        status: 'LOGGED_IN',
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
      let updateNav = (activePage) => {
        let newNav = { home: false, history: false, post: false }
        newNav[activePage] = true;
        this.navProps.navState = newNav
      }

      if (to.path === '/history') {
        console.log("route change and route.path === '/history'")
        this.$bindAsArray('oldCoasters', coastersRef.orderByChild('date').endAt('2016-01-01'))
        this.currentList = this.oldCoasters
        updateNav('history')
      } else if (to.path === '/') {
        console.log("route change and route.path === '/'")
        this.currentList = this.coasters
        updateNav('home')
      } else {
        updateNav('post')
      }
    }
  },
  computed: {
    count () {
      return this.$store.state.count
    },
    hundreds () {
      return this.$store.getters.hundreds
    },
    currentList () {
      if (this.list === 'offLine') {
        return this.$store.state.coasters
      } else {
        return this.coasters
      }
    },

    routerViewProps () {
      return {
        authState: this.authState
      }
    },
    modalProps () {
      let mProps = this.modal
      mProps.authState = this.authState
      return mProps
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
    handleAuthStateChange (e) {
      console.log(e)
    },
    makeLocal () {
      this.list = 'offLine'
    },
    makeFirebase () {
      this.list = 'firebase'
    },
    increment () {
      this.$store.commit('increment')
    },
    decrement () {
    	this.$store.commit('decrement')
    },
    incrementAsync () {
      this.$store.dispatch('increment')
    }
  }
}
</script>

<style>

ul {
  list-style-type: none;
}

img.close {
  max-width: 1em;
  float: right;
}
</style>
