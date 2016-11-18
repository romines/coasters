<template>
  <div id="my-app">
    <navigation></navigation>
    <router-view :coasters="currentList"></router-view>
  </div>
</template>

<script>
import _ from 'underscore'
import bus from '../bus'
import router from '../router'
import Navigation from './Navigation.vue'
import firebase from '../firebase'
import mixins from '../mixins'

const db = firebase.database()
const auth = firebase.auth()
// auth.createUserWithEmailAndPassword('01@email.com', 'password')
auth.onAuthStateChanged(user => console.log(user))

const coastersRef = db.ref('data/coasters')
const notPickedUp = coastersRef.orderByChild('pickedUp').equalTo(false)
const pickedUp = coastersRef.orderByChild('pickedUp').equalTo(true)

function handleLoginEvent(e) {

  let email = e.payload.email
  let password = e.payload.password

  let promise = auth.signInWithEmailAndPassword(email, password)
  promise.catch(e => console.log(e.message))

}

function handleLoginEvent(e) {

  let promise = auth.signInWithEmailAndPassword(e.payload.email, e.payload.password)
  promise.catch(e => console.log(e.message))

}

function handleCreateUserEvent(e) {

  let promise = auth.createUserWithEmailAndPassword(e.payload.email, e.payload.password)
  promise.catch(e => console.log(e.message))

}

function handleLogOutUserEvent() {

  firebase.auth().signOut()

}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log(user);
  } else {
    console.log('no one logged in');
  }
})

function removeCoaster(key) {
  coastersRef.child(key).remove()
}

function fbRefFromChild(child, equalTo) {
  return coastersRef.orderByChild(child).equalTo(equalTo)
}

function attachListeners(vm) {
  bus.$on('remove-coaster', (coaster) => {
    removeCoaster(coaster['.key'])
  })
  bus.$on('new-coaster', (coasterData) => {
    if (!coasterData) return
    let decoratedCoaster = Object.assign({pickedUp: true}, coasterData)
    coastersRef.push(decoratedCoaster)
  })
  bus.$on('msg', (event) => {
    switch (event.type) {
      case bus.SIGN_IN:
        handleLoginEvent(event)
        break;
      case bus.CREATE_USER:
        handleCreateUserEvent(event)
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
    coasters: coastersRef
    // notPickedUp: coastersRef.orderByChild('pickedUp').equalTo(false)
  },
  components: {
    Navigation
  },
  created () {
    attachListeners(this)
    // this.$bindAsArray('currentCoasters', coastersRef.orderByChild('date').startAt('2016-01-12'))
    // this.currentList = this.currentCoasters
  },
  data: function () {
    return {
      detailKey: null,
      currentList: this.coasters
    }
  },
  watch: {
    '$route' (route) {
      if (route.path === '/history') {
        console.log("route.path === '/history'")
        this.$bindAsArray('currentCoasters', coastersRef.orderByChild('date').startAt('2016-01-12'))
        // this.$bindAsArray('someCoasters', coastersRef)
        this.currentList = this.currentCoasters
      } else {

        console.log('something else')
      }
    }
  },
  // computed: {
  //
  //   detail () {
  //
  //     let getCoasterByKey = (key) => {
  //       let obj = {}
  //       obj['.key'] = key
  //       return _.where(this.coasters, obj)[0]
  //     }
  //
  //     return getCoasterByKey(this.detailKey)
  //   }
  // },
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
