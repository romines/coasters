<template>
  <div id="app">
    <img src="../assets/logo.png">
    <input v-model="parentMessage" @keyup.enter="addCoaster">
    <list @interEvent="handleChildEvent($event)" :coasters="coasters" :my-message="parentMessage"></list>
    <new @new="newCoaster($event)"></new>
  </div>
</template>

<script>
import List from './List.vue'
import New from './New.vue'
import firebase from '../firebase'
let db = firebase.fb.database()


export default {
  firebase: {
    coasters: db.ref('data/coasters')
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
    addCoaster (text) {
      console.log(text);
      if (text) {
        this.$firebaseRefs.coasters.push({
          text: text.trim()
        })
        this.parentMessage = ''
      }
    },
    newCoaster (event) {
      console.log('to app component')
      console.log(event)
      this.$firebaseRefs.coasters.push(event[1])
    },
    handleChildEvent (event) {
      console.log("Hey! A 'remove' event happened..", event);

      // this.$firebaseRefs.coasters.child(key).remove()
    }
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
