<template lang="html">
  <div class="detail">
    <coaster :options="{}" v-if="coaster" :coaster="coaster">

      <textarea slot="newComment" v-model="comment" v-if="commenting" class="textarea"></textarea>

      <footer slot="buttons" class="card-footer">

        <span v-show="!commenting" class="coaster-actions default card-footer-item">
          <a v-if="!myOwnCoaster" @click.stop="pickUp" class="button is-primary">Pick Up</a>
          <a @click.stop="startCommenting()" class="button">Comment</a>
          <a v-if="myOwnCoaster" @click.stop="cancelCoaster()" class="button">Remove</a>
        </span>

        <span class="coaster-actions card-footer-item" v-if="commenting">
          <a @click.stop="postComment" class="button is-primary">Post Comment</a>
          <a @click.stop="cancelComment" class="button">Cancel</a>
        </span>

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

  data () {
    return {
      commenting: false,
      comment: ''

    }
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
      this.commenting = true
    },
    cancelComment () {
      this.commenting = false
    },
    postComment () {
      // console.log(this.comment);
      let payload = {}

      payload.coaster = this.coaster
      payload.comment = this.comment
      this.$store.dispatch('postComment', payload)
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

<style lang="scss">
.coaster-actions {
  justify-content: space-around;
}
</style>
