<template lang="html">
  <div class="detail">
    <h1>This is the Detail component</h1>
    <h2>{{coasterKey}}</h2>
    <!-- <coaster :coaster="coaster"></coaster> -->
    <coaster  v-for="coaster in coasters" :coaster="coaster"></coaster>


  </div>
</template>

<script>
import Coaster from './Coaster.vue'

export default {
  props: ['coasters', 'coasterKey'],
  data () {
    return {}
  },
  beforeUpdate () {
    console.log('coaster', this.coaster);
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
