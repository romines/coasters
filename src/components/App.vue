<template>
  <div id="app">
    <img src="../assets/logo.png">
    <list @interEvent="handleChildEvent($event)" :coasters="coasters"></list>
    <detail :coasters="coasters" :coasterKey="currDetailKey"></detail>
    <new @new="newCoaster($event)"></new>
    <!-- <pre>
      {{selected}}
    </pre> -->
  </div>
</template>

<script>
import List from './List.vue'
import New from './New.vue'
import Detail from './Detail.vue'
import firebase from '../firebase'
let db = firebase.fb.database()
var coastersRef = db.ref('data/coasters')


export default {
  firebase: {
    coasters: coastersRef
  },
  components: {
    List,
    New,
    Detail
  },
  data () {
    return {
      currDetailKey: '-KTMpVIPjvNdOo65U4pV',
      currentDetail: {
        time: 'time',
        date: 'date',
        comment: 'comment',
        shiftType: 'shiftType'
      }
    }
  },
  methods: {
    handleChildEvent (event) {
      console.log(event)
      // if (event) console.log("Hey! An action happened..", event)
      // if (event.action === 'MAKE_DETAIL') {
      //   // console.log(event.key)
      //   this.makeDetail(event.key)
      // }


    },
    makeDetail (key) {
      console.log(key);
      // console.log(this.coasters)
      // console.log(db.ref('data/coasters/' + key))
      console.log(coastersRef.child(key));
      this.currentDetail = coastersRef.child(key)
    },
    newCoaster (event) {
      console.log('to app component')
      console.log(event)
      this.$firebaseRefs.coasters.push(event[1])
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
