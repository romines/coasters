<template lang="html">
  <div class="detail">
    <ul>
      <coaster :coaster="coaster" as="DETAIL"></coaster>
    </ul>
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
