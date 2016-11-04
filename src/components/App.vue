<template>
  <div id="app">
    <list @interEvent="handleChildEvent($event)" :coasters="coasters"></list>
    <detail v-if:detail :coaster="detail"></detail>
    <new @new="newCoaster($event)"></new>
  </div>
</template>

<script>
import List from './List.vue'
import New from './New.vue'
import Detail from './Detail.vue'
import firebase from '../firebase'
let db = firebase.database()
var coastersRef = db.ref('data/coasters')
const FAVORITE = '-KTMpVIPjvNdOo65U4pV'

export default {
  components: {
    List,
    New,
    Detail
  },
  data () {
    return {
      coasters: [],
      detail: null
    }
  },
  created () {
      coastersRef.on('child_added', (snapshot) => {
          let coaster = {
              key: snapshot.key,
              data: snapshot.val()
          }
        //   let coaster = snapshot.val()
          console.log(coaster)
          this.coasters.unshift(coaster)
      })
  },
  methods: {
    handleChildEvent (event) {

      if (event.action === 'MAKE_DETAIL') {
        this.makeDetail(event.key)
      }


    },
    makeDetail (key) {
      // console.log(this.coasters)
      // console.log(db.ref('data/coasters/' + key))
      this.currentDetailDate = coastersRef.child(key).child('date');
      console.log("coastersRef.child(key).child('date')", coastersRef.child(key).child('date'))
    },
    newCoaster (event) {
      console.log('to app component')
      console.log(event)
    }
  },
  computed: {
    selected: function () {
      console.log('wha wha wha', coastersRef.child(this.currDetailKey));
      return coastersRef.child(this.currDetailKey)
    }
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
