<template>
  <div id="app">
      <div class="dynamic-container">
          <component :is="currentView" :coaster="detail"></component>
      </div>
    <!-- <detail v-if="detail" :coaster="detail"></detail> -->
    <list :coasters="coasters"></list>
  </div>
</template>

<script>
import _ from 'underscore'
import bus from '../bus'
import List from './List.vue'
import New from './New.vue'
import Detail from './Detail.vue'
import firebase from '../firebase'
const db = firebase.database() // syntax here depends on config in ../firebase.js, which is not in git

const coastersRef = db.ref('data/coasters')

function removeCoaster(key) {
  coastersRef.child(key).remove()
}

function attachListeners(vm) {
  bus.$on('remove-coaster', (coaster) => {
    removeCoaster(coaster['.key'])
  })
  bus.$on('new-coaster', (coasterData) => {
    if (!coasterData) return
    coastersRef.push(coasterData)
  })
  bus.$on('msg', (event) => {
    switch (event.type) {
      case bus.MAKE_DETAIL:
        vm.detailKey = event.payload['.key'],
        vm.currentView = Detail
        break;
      case bus.CLOSE_DETAIL:
        vm.currentView = New
    }
  })
}

export default {
  firebase: {
    coasters: coastersRef
  },
  data: function () {
    return {
      detailKey: null,
      currentView: New,
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
  components: {
    List,
    New,
    Detail
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
</style>
