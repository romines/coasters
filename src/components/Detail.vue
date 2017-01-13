<template lang="html">
  <div class="detail">
    <coaster :options="{}" v-if="coaster" :coaster="coaster">
      <title-bar slot="titleBar">Hi, I'm the title bar from the Detail view</title-bar>


      <footer slot="buttons" class="card-footer">
        <a v-if="!myOwnCoaster" @click.stop="pickUp" class="card-footer-item">Pick Up</a>
        <a @click.stop="startCommenting()" class="card-footer-item">Comment</a>
        <a v-if="myOwnCoaster" @click.stop="cancelCoaster()" class="card-footer-item">Cancel</a>
      </footer>
    </coaster>
  </div>
</template>

<script>

import Coaster from './Coaster/Coaster.vue'
import router from '../router'

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
        setTimeout(() => {router.push('/picked-up')}, 400)
      }

      let launchLoginModal = () => {
        this.$store.commit('SHOW_MODAL', {component: 'Login'})
      }

      if (!this.$store.state.authState.user) {
        this.$store.commit('SHOW_MODAL', {
          component:'Confirmation',
          heading: 'You Must Login',
          message: '. . . before picking up shifts',
          buttons: [
            {
              label: 'Login',
              action: launchLoginModal,
              classList: 'is-primary'
            }
          ]
        })
      } else {
        this.$store.commit('SHOW_MODAL', {
          component:'Confirmation',
          heading: 'Confirm Pickup',
          message: 'Are you sure you want to pick up this shift?',
          buttons: [
            {
              label: 'Confirm',
              action: pickItUp,
              classList: 'is-primary'
            }
          ]
        })
      }


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
