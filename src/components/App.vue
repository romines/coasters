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
    if (event.type === bus.REVERSE_LIST) {
      vm.first = (vm.first === 'newest') ? 'oldest' : 'newest'
    }
  })
}

export default {
  firebase: {
    coasters: coastersRef
  },
  data: function () {
    return {
      first: 'newest'
    }
  },
  computed: {
    sortedCoasters: function () {
      console.log('sorting...');
      if (this.first === 'newest') {
        return _.sortBy(this.coasters, '.key').reverse()
      }
      else {
        return _.sortBy(this.coasters, '.key')
      }
    }
  },
  components: {
    List,
    New
  },
  methods: {

  },
  created () {
    attachListeners(this)
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
