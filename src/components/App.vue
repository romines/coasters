<template>
  <div id="app">
      <div class="dynamic-container">
          <component :is="currentView" :coaster="detail"></component>
      </div>
      <navigation></navigation>
    <list :coasters="currentList"></list>
  </div>
</template>

<script>
import _ from 'underscore'
import bus from '../bus'
import Navigation from './Navigation.vue'
import List from './List.vue'
import New from './New.vue'
import Detail from './Detail.vue'
import firebase from '../firebase'
import mixins from '../mixins'

const db = firebase.database() // syntax here depends on config in ../firebase.js, which is not in git

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
        vm.detailKey = event.payload['.key'],
        vm.currentView = Detail
        break;
      case bus.CLOSE_DETAIL:
        vm.currentView = New
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
    Navigation,
    List,
    New,
    Detail
  },
  data: function () {
    return {
      detailKey: null,
      currentView: New,
      currentList: this.coasters
    }
  },
  computed: {

    detail () {

      let getCoasterByKey = (key) => {
        let obj = {}
        obj['.key'] = key
        return _.where(this.coasters, obj)[0]
      }

      return getCoasterByKey(this.detailKey)
    }
  },
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
