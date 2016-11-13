<template lang="html">
  <div class="detail">
    <ul>
      <coaster :coaster="coaster" as="DETAIL"></coaster>
    </ul>
  </div>
</template>

<script>
import firebase from '../firebase'
const db = firebase.database()
const coastersRef = db.ref('data/coasters')

import Coaster from './Coaster.vue'
export default {
  beforeMount () {
    this.$bindAsObject('coaster', coastersRef.child(this.$route.params.key))
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
