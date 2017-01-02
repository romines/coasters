<template lang="html">
  <footer class="card-footer">
    <a class="card-footer-item">Pick Up</a>
    <a @click="startCommenting()" class="card-footer-item">Comment</a>
    <a class="card-footer-item">Delete</a>
  </footer>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {
    startCommenting () {
      console.log('commenting..')
    }
  },
  components: {}
}
</script>

<style lang="css">
</style>
