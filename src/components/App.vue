<template>
  <div id="app">
    <new></new>
    <detail v-if="detail" :coaster="detail"></detail>
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
const db = firebase.fb.database()

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
        vm.detailKey = event.payload['.key']
    }
  })
}

export default {
  firebase: {
    coasters: coastersRef
  },
  data: function () {
    return {
      detailKey: null
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
</style>
