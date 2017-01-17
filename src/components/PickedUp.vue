<template lang="html">
  <div class="home">
    <h1 class="title header">Covered Shifts</h1>
    <!-- <list :coasters="pickedUp" :options="{showPickedUp: true}"></list> -->
    <div class="list">
      <ul>
        <coaster :options="{showPickedUp: true}" v-for="coaster in pickedUp" :coaster="coaster">
          <div slot="cardHeader">Hi, I'm the special header from the PickedUp view</div>

        </coaster>
      </ul>
    </div>
  </div>
</template>

<script>
// import List from './List.vue'
import Coaster from './Coaster/Coaster.vue'

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
  components: { Coaster },
  methods: {},
}
</script>

<style lang="css">
</style>
