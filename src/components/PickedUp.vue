<template lang="html">
  <div class="home">
    <h1 class="title header">Historical Shifts</h1>
    <list :coasters="historical"></list>
  </div>
</template>

<script>
import List from './List.vue'

export default {
  data () {
    return {
    }
  },
  created () {
    console.log('PickedUp component was created');
    this.$store.dispatch('getHistorical')
  },
  computed: {
    historical () {
      return this.$store.state.historical
    }
  },
  components: { List },
  methods: {},
}
</script>

<style lang="css">
</style>
