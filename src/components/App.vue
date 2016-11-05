<template>
  <div id="app">
    <new></new>
    <list :coasters="sortedCoasters"></list>
  </div>
</template>

<script>
import _ from 'underscore'
import bus from '../bus'
import List from './List.vue'
import New from './New.vue'
import firebase from '../firebase'
const db = firebase.fb.database()

// const coastersRef = db.ref('data/coasters').orderByKey()
const coastersRef = db.ref('data/coasters')

function removeCoaster(key) {
  coastersRef.child(key).remove()
}

function attachListeners() {
  bus.$on('remove-coaster', (coaster) => {
    removeCoaster(coaster['.key'])
  })
  bus.$on('new-coaster', (coasterData) => {
    if (!coasterData) return
    coastersRef.push(coasterData)
  })
}

export default {
  firebase: {
    coasters: coastersRef
  },
  computed: {
    sortedCoasters: function () {
      console.log('trying to reverse..');
      return _.sortBy(this.coasters, '.key').reverse()
    }
  },
  components: {
    List,
    New
  },
  data: function () {
    return {
      parentMessage: ''
    }
  },
  methods: {
    // newCoaster (event) {
    //   if (!event.payload) return
    //   coastersRef.push(event.payload)
    // },
  },
  created () {
    attachListeners()
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
