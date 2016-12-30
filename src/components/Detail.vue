<template lang="html">
  <div class="detail">
    <div class="id"></div>
    <coaster as:="'DETAIL'"></coaster>
  </div>
</template>

<script>
//
// Should encompass <list> and <coaster>, which is hidden with styles on mobile
//
import { firebase } from '../libs'
const db = firebase.database()
const coastersRef = db.ref('data/coasters')

import Coaster from './Coaster/Coaster.vue'

export default {
  computed: {
    // coaster () {
    //   return this.$store.getters.detailCoaster
    // }
  },
  components: {
    Coaster
  }
}
</script>

<style lang="css">
ul {
    margin-top: 0;
}
</style>
