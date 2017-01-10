<template lang="html">
  <div class="home">
    <h1>Hello from Picked Up component</h1>
    <list v-bind:bindOptions="listOptions"></list>
  </div>
</template>

<script>
import List from './List.vue'

export default {
  data () {
    return {

    }
  },
  computed: {
    listOptions () {
      return {
        foo: 'bar'
      }
    }
  },
  components: { List },
  mounted () {},
  methods: {},
}
</script>

<style lang="css">
</style>
