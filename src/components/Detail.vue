<template lang="html">
  <div class="detail">
    <coaster :coaster="coaster"></coaster>
  </div>
</template>

<script>
import Coaster from './Coaster.vue'
export default {
  props: ['coaster'],
  data () {
    return {}
  },
  // beforeUpdate () {
  //   console.log('beforeUpdate')
  // },
  computed: {},
  mounted () {},
  methods: {},
  components: {
    Coaster
  }
}
</script>

<style lang="css">
</style>
