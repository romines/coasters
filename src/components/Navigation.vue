<template lang="html">
  <div class="navigation">
    <span @click="changeList()" class="coaster-category">Open</span>
    <span class="coaster-category">Picked Up</span>
    <span class="coaster-category">Old</span>
  </div>
</template>

<script>
import bus from '../bus'
export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {
    changeList (e) {
      bus.$emit('msg', {
        type: bus.CHANGE_LIST,
        payload: {}
      })
    }
  },
  components: {}
}
</script>

<style lang="scss">
.navigation {
  padding-bottom: .6em;
  margin-bottom: .6em;
  .coaster-category {
    display: inline-block;
    padding: .3em;
    background-color: rgb(173, 107, 115);
  }
}
</style>
