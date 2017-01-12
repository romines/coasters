<template lang="html">
  <div class="home container">
    <h1 class="title header">Available Shifts</h1>
    <list :coasters="coasters"></list>
  </div>
</template>

<script>
import List from './List.vue'
import router from '../router'

export default {
  data () {
    return {}
  },
  components: { List },
  created () {
    this.$store.dispatch('getCoasters')
    // setTimeout(() => {
    //   console.log(this.$store.state.authState.user.uid);

    // }, 1200)
  },
  computed: {
    listOptions () {
      return {
        foo: 'baz'
      }
    },
    coasters () {
      return this.$store.state.coasters.filter((coaster) => {
        return !coaster.history
      })
    }
  },
  methods: {

  },
  mounted () {},
}
</script>

<style lang="css">
</style>
