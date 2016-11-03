<template lang="html">
  <div class="detail">
    <h1>This is the Detail component</h1>
    <coaster :coaster="coaster"></coaster>
  </div>
</template>

<script>
import Coaster from './Coaster.vue'

export default {
  props: ['coaster'],
  data () {
    return {}
  },
  beforeUpdate () {
    console.log('beforeUpdate event on the coaster', this.coaster);
  },
  components: {
    Coaster
  }
}
</script>

<style lang="css">
</style>
