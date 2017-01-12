<template lang="html">
  <div class="home container">
    <h1 class="title header">Available Shifts</h1>
    <list :coasters="coasters"></list>
  </div>
</template>

<script>
import List from './List.vue'

export default {
  data () {
    return {}
  },
  created () {
    this.$store.dispatch('getCoasters')
  },
  computed: {
    listOptions () {
      return {
        foo: 'baz'
      }
    },
    coasters () {
      return this.$store.state.coasters
    }
  },
  components: { List },
  mounted () {},
  methods: {},
}
</script>

<style lang="css">
</style>
