<template lang="html">
  <div class="detail">
    <h1>This is the Detail component</h1>
    <h2>coasterDate: {{coasterDate}}</h2>
    <!-- <coaster :coaster="coaster"></coaster> -->

  </div>
</template>

<script>
import Coaster from './Coaster.vue'

export default {
  props: ['coasterDate'],
  data () {
    return {}
  },
  beforeUpdate () {
    console.log('coasterDate', this.coasterDate);
  },
  computed: {},
  ready () {},
  attached () {},
  methods: {},
  components: {
    Coaster
  }
}
</script>

<style lang="css">
</style>
