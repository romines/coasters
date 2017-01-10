<template lang="html">
  <div class="home">
    <h1>Hello from Home component</h1>
    <list v-bind:bindOptions="listOptions"></list>
  </div>
</template>

<script>
import List from './List.vue'

export default {
  data () {
    return {}
  },
  created () {
    console.log('Home was created');
  },
  computed: {
    listOptions () {
      return {
        foo: 'baz'
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
