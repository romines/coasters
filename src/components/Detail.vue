<template lang="html">
  <div class="detail">
    <coaster :coaster="coaster" as="DETAIL"></coaster>
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
  beforeMount () {
    this.$bindAsObject('coaster', coastersRef.child(this.$route.params.id))
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
