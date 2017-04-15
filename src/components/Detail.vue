<template lang="html">
  <div class="detail">
    <coaster :options="{}" v-if="coaster" :coaster="coaster">


      <footer slot="primaryButtons" class="card-footer">

        <span class="coaster-actions default card-footer-item">
          <a @click.stop="pickUp" class="button is-primary">Pick Up</a>
          <a @click.stop="startCommenting()" class="button">Comment</a>
          <a v-if="elligibleForPickup" @click.stop="cancelCoaster()" class="button">Remove</a>
        </span>

      </footer>

      <div slot="comments" class="comments">
        <div v-for="comment in comments" class="comment-container">
          <figure class="commenting-user">
            <img v-if="comment.postedBy.photoURL" :src="comment.postedBy.photoURL" class="image is-48x48">
            <span v-if="!comment.postedBy.photoURL" class="icon is-large">
              <i class="fa fa-user"></i>
            </span>
          </figure>
          <div class="contents">
            <div class="text">{{comment.text}}</div>
            <div class="date"><small>{{comment.postedBy.name}}</small></div>
            <div class="date"><small>{{dateCommentPosted(comment.when)}}</small></div>
          </div>
        </div>

      </div>

      <div slot="newComment" v-show="commenting" class="newComment">
        <textarea v-model="comment" ref="newCommentBox" class="textarea"></textarea>
        <span class="coaster-actions card-footer-item">
          <a @click.stop="postComment" class="button is-primary">Post Comment</a>
          <a @click.stop="cancelComment" class="button">Cancel</a>
        </span>
      </div>



    </coaster>
  </div>
</template>

<script>

import Coaster from './Coaster/Coaster.vue'
import router from '../router'
import moment from 'moment'

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
    elligibleForPickup () {
      return true
    },
    detailKey () {
      return this.$store.getters.detailKey
    },
    comments () {
      if (!this.coaster) return []
      let comments = []
      if (this.coaster.coasterComments) {
        for (var [key, comment] of Object.entries(this.coaster.coasterComments)) {
          comments.push(comment)
        }
      }
      return comments
    }

  },

  methods: {
    startCommenting () {
      let launchLoginModal = () => {
        this.$store.commit('SHOW_MODAL', {component: 'Login'})
      }

      if (!this.$store.state.authState.user) {
        this.$store.commit('SHOW_MODAL', {
          component:'Confirmation',
          heading: 'You Must Login',
          message: '. . . before commenting',
          buttons: [
            {
              label: 'Login',
              action: launchLoginModal,
              classList: 'is-primary'
            }
          ]
        })
      } else {
        this.commenting = true
        this.$nextTick(() => {
          console.log(this.$refs.newCommentBox)
          this.$refs.newCommentBox.focus()
        })
      }
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
      this.comment = ''
      this.commenting = false

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

    },

    dateCommentPosted (dateString) {
      return moment(dateString).fromNow()
    },

    myOwnCoaster () {
      if (!(this.$store.state.authState.user && this.coaster)) return
      return this.coaster.postedBy.uid === this.$store.state.authState.user.uid
    }
  }



}
</script>

<style lang="scss">
.coaster-actions {
  justify-content: space-around;
}
.comment-container {
  display: flex;
  align-items: center;
  padding: .25em 0;
  border-top: 1px solid #dbdbdb;
  .commenting-user {
    display: inline-flex;
    flex-shrink: 0;
    margin-right: .8em;
    img {
      object-fit: cover;
      object-position: center;
    }
  }
}
</style>
