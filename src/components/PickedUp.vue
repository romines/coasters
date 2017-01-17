<template lang="html">
  <div class="home">
    <h1 class="title header">Covered Shifts</h1>
    <list :coasters="pickedUp" :options="{showPickedUp: true}"></list>
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
    if (this.pickedUp.length <1) this.$store.dispatch('getCoasters')
  },
  computed: {
    pickedUp () {
      return this.$store.state.coasters.filter((coaster) => {
        return coaster.coasterHistory
      })

    }
  },
  components: { List },
  methods: {},
}
</script>

<style lang="css">
</style>
