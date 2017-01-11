<template lang="html">
  <div class="detail">
    <coaster v-if="coaster" :coaster="coaster"></coaster>
  </div>
</template>

<script>

import Coaster from './Coaster/Coaster.vue'

export default {

  components: {
    Coaster
  },

  computed: {

    coaster () {
      return this.$store.getters.detailCoaster
    }

  },
  created () {
    if (!this.coaster) this.$store.dispatch('getCoasters')
  },


}
</script>

<style lang="css">
ul {
    margin-top: 0;
}
</style>
