<template lang="html">
  <div class="detail">
    <ul>
      <coaster :coaster="coaster" as="DETAIL"></coaster>
    </ul>
  </div>
</template>

<script>
import Coaster from './Coaster.vue'
export default {
  props: ['coaster'],
  data () {
    return {}
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
