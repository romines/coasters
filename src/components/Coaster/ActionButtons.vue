<template lang="html">
  <footer class="card-footer">
    <a v-if="!myOwnCoaster" @click.stop="pickUp" class="card-footer-item">Pick Up</a>
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
      return this.postedBy === this.$store.state.authState.user.uid
    }
  },
  methods: {
    startCommenting () {
      console.log('commenting..')
    },
    pickUp () {
      this.$store.commit('SHOW_MODAL', {
        component:'Confirmation',
        heading: 'Confirm Pickup',
        message: 'Are you sure you want to pick up this shift?'
      })
    },
    cancelCoaster () {

      let cancel = () => {
        this.$store.dispatch('cancelCoaster')
      }

      this.$store.commit('SHOW_MODAL', {
        component:'Confirmation',
        heading: 'Cancel Posted Shift',
        message: 'Are you sure you want to cancel this shift?'
      })

    }
  },
  components: {}
}
</script>

<style lang="css">
</style>
