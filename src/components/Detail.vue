<template lang="html">
  <div class="detail">
    <coaster v-if="coaster" :coaster="coaster">
      <footer class="card-footer">
        <a v-if="!myOwnCoaster" @click.stop="pickUp" class="card-footer-item">Pick Up</a>
        <a @click.stop="startCommenting()" class="card-footer-item">Comment</a>
        <a v-if="myOwnCoaster" @click.stop="cancelCoaster()" class="card-footer-item">Cancel</a>
      </footer>
    </coaster>
  </div>
</template>

<script>

import Coaster from './Coaster/Coaster.vue'

export default {

  components: {
    Coaster
  },

  computed: {

    coaster () {
      return this.$store.getters.detailCoaster
    },
    myOwnCoaster () {
      if (!(this.$store.state.authState.user && this.coaster)) return
      return this.coaster.postedBy.uid === this.$store.state.authState.user.uid
    },
    detailKey () {
      return this.$store.getters.detailKey
    }

  },
  created () {
    if (!this.coaster) this.$store.dispatch('getCoasters')
    setTimeout(() => {
      console.log('This is my coaster: ' + this.myOwnCoaster);
    })
  },
  methods: {
    startCommenting () {
      console.log('commenting..')
    },
    pickUp () {

      let pickItUp = () => {
        this.$store.dispatch('pickUpCoaster', this.coaster)
      }

      this.$store.commit('SHOW_MODAL', {
        component:'Confirmation',
        heading: 'Confirm Pickup',
        message: 'Are you sure you want to pick up this shift?',
        actions: {
          onConfirm: pickItUp
        }
      })
    },
    cancelCoaster () {

      let cancel = () => {
        this.$store.dispatch('cancelCoaster', this.detailKey)
        router.push({name: 'home'})
      }

      this.$store.commit('SHOW_MODAL', {
        component:'Confirmation',
        heading: 'Cancel Posted Shift',
        message: 'Are you sure you want to cancel this shift?',
        actions: {
          onConfirm: cancel
        }
      })

    }
  }



}
</script>

<style lang="css">
ul {
    margin-top: 0;
}
</style>
