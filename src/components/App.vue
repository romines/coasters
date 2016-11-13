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

const coastersRef = db.ref('data/coasters')
const notPickedUp = coastersRef.orderByChild('pickedUp').equalTo(false)
const pickedUp = coastersRef.orderByChild('pickedUp').equalTo(true)

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
      case bus.MAKE_DETAIL:
        vm.detailKey = event.payload['.key']
        router.push({
          name: 'detail',
          params: { key: event.payload['.key']}
        })
        break;
      case bus.CLOSE_DETAIL:
        router.push({ path: '/' })
      case bus.CHANGE_LIST:
      console.log('change list, please')
        vm.$bindAsArray('notPickedUp', fbRefFromChild('pickedUp', false))
        vm.currentList = vm.notPickedUp
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
  data: function () {
    return {
      detailKey: null,
      currentList: this.coasters
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

  },
  created () {
    attachListeners(this)
  },
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
