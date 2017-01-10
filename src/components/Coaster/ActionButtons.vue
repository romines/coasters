<template lang="html">
  <footer class="card-footer">
    <a @click.stop="pickUp" class="card-footer-item">Pick Up</a>
    <a @click.stop="startCommenting()" class="card-footer-item">Comment</a>
    <a v-if="myOwnCoaster" @click.stop="cancelCoaster()" class="card-footer-item">Cancel</a>
  </footer>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: ['postedBy'],
  computed: {
    myOwnCoaster () {
      console.log(this.postedBy, this.$store.state.authState.user.uid)
      return this.postedBy === this.$store.state.authState.user.uid
    }
  },
  mounted () {},
  methods: {
    startCommenting () {
      console.log('commenting..')
    },
    pickUp () {
      this.$store.commit('SHOW_MODAL', {component:'Confirmation', message: 'Are you sure you want to pick up this shift?'})
    },
    cancelCoaster () {
      console.log('cancel!');
    }
  },
  components: {}
}
</script>

<style lang="css">
</style>
