<template lang="html">
  <div class="detail">
    <coaster :options="{}" :coaster="coaster" :class="{ isCommenting : commenting}">


      <div v-if="coaster.history" slot="main">

        <div class="header">
          <div class="shift-date">{{longDateString}}</div>
          <div class="shift-description">{{coaster.time + ' ' + coaster.shiftType}}</div>
        </div>

        <trade-detail :coaster="coaster" :whenPosted="whenPosted"></trade-detail>
      </div>

      <div slot="comments" class="comments">
        <div class="top-level-comment">
          <div class="comment is-4">{{coaster.comment}}</div>
        </div>


        <div slot="primaryButtons" v-if="!commenting" class="card-actions">

          <div class="section-title">Actions</div>

          <span class="coaster-actions default">

            <a v-if="elligibleForPickup && !$store.getters.isAdmin" @click.stop="pickUp" class="button is-info">Pick Up</a>
            <a v-if="elligibleForRepost" @click.stop="repost" class="button is-primary">Repost</a>
            <a v-if="elligibleForCancel" @click.stop="cancelCoaster" class="button is-warning">Cancel</a>
            <span v-if="!hasComments" @click.stop="startCommenting()" class="button">Comment</span>

            <span v-if="$store.getters.isAdmin" class="admin-actions">
              <a v-if="elligibleForPickup" @click.stop="pickUpAs" class="button">Pick Up</a>
              <a v-if="!coaster.available" @click.stop="repost" class="button is-primary">Repost</a><br>
              <span @click.stop="flagCoaster()" v-if="$store.getters.isAdmin" class="button is-warning"><span v-if="coaster.flagged" class="un-flag">Un-</span>Flag</span>
              <a @click.stop="adminRemove" class="button">Delete</a>
            </span>

          </span>

        </div>

        <div v-if="hasComments" class="comments">
          <div class="section-title">Comments</div>

          <!--  Existing Comments -->
          <div v-for="comment in coaster.comments" v-if="!selectingFlags" class="comment-container">
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

          <span @click.stop="startCommenting()" v-if="hasComments && !commenting" class="button comment-button">Reply</span>


        </div>
        <!--  New Comment-->
        <div slot="newComment" class="newComment">
          <div v-if="commenting" class="new-comment-container">
            <textarea v-model="comment" ref="newCommentBox" class="textarea"></textarea>
            <span class="coaster-actions card-footer-item">
              <a @click.stop="cancelComment" class="button">Cancel</a>
              <a @click.stop="postComment" class="button is-primary">Post</a>
            </span>
          </div>
        </div>

      </div>

    </coaster>
  </div>
</template>

<script>

import Coaster from './Coaster/Coaster.vue'
import TradeDetail from './Coaster/TradeDetail.vue'
import router from '../router'
import moment from 'moment'

export default {

  components: {
    Coaster,
    TradeDetail
  },

  data () {
    return {
      commenting: false,
      selectingFlags: false,
      comment: ''

    }
  },

  computed: {

    coaster () {
      return this.$store.state.detailCoaster
    },
    myOwnCoaster () {
      if (this.$store.state.authState.user) {
        return this.coaster.heldBy.uid == this.$store.state.authState.user.uid
      }
    },
    elligibleForPickup () {
      return this.coaster.available && !this.myOwnCoaster
    },
    elligibleForCancel () {
      return this.coaster.available && this.myOwnCoaster
    },
    elligibleForRepost () {
      return !this.coaster.available && this.myOwnCoaster
    },
    detailKey () {
      return this.$store.getters.detailKey
    },
    hasComments () {
      if (!this.coaster.comments) return
      return Object.keys(this.coaster.comments).length
    },
    longDateString () {
      return moment(this.coaster.date).format('dddd, MMM Do')
    },
    whenPosted () {
      if (this.coaster.history) {
        const historyKeys  = Object.keys(this.coaster.history);
        const firstKey     = historyKeys[0];
        return moment(this.coaster.history[firstKey].posted).fromNow()
      }
    },
    actionsAvailable () {
      return this.elligibleForPickup || this.elligibleForRepost || $store.getters.isAdmin
    }

  },

  methods: {
    startCommenting () {
      console.log('Trying to startCommenting . . .');
      let launchLoginModal = () => {
        this.$store.commit('SHOW_MODAL', {component: 'Login'})
      }

      if (!this.$store.state.authState.user) {      // TODO: use app wide standard 'not logged in' behavior w/ navi guards
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
          this.$refs.newCommentBox.focus()
        })
      }
    },

    cancelComment () {
      this.commenting = false
    },

    postComment () {

      let payload = {}

      payload.coaster = this.coaster
      payload.comment = this.comment
      this.$store.dispatch('postComment', payload)
      this.comment = ''
      this.commenting = false
    },
    flagCoaster () {
      if (!this.coaster.flagged) this.coaster.flagged = true
      else {
        this.coaster.flagged = false
      }
      this.$store.dispatch('flagCoaster', this.coaster )
    },

    pickUp () {

      let pickItUp = () => {
        this.$store.dispatch('pickUpCoaster', {coaster: this.coaster})
        setTimeout(() => {router.push('/picked-up')}, 400) // TODO: hand modal an onSuccess to handle routing
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

    pickUpAs () {
      const confirmPickupAs = (user) => {
        this.$store.commit('SHOW_MODAL', {
          component:'PickUpAs',
          props: {
            coaster: this.coaster
            , user
          }
        })
      }

      this.$store.commit('SHOW_MODAL', {component: 'Loading'})

      this.$store.dispatch('getPromisedUsers').then(() => {
        this.$store.commit('SHOW_MODAL', {component: 'UserSearch', props: {
          coaster: this.coaster,
          onUserClick: confirmPickupAs
         }
       })
      })
    },

    adminRepost () {
      // same as regular repost, for now
    },

    adminRemove () {
      let cancelCoaster = () => {
        this.$store.dispatch('adminRemove', this.detailKey)
        this.$store.commit('CLOSE_MODAL')
        if (this.$store.state.route.name === 'detail') router.push({name: 'home'})
      }

      this.$store.commit('SHOW_MODAL', {
        component:'Confirmation',
        heading: 'Delete Posted Shift',
        message: 'Are you sure you want to delete this post? This removes all records of this shift including any trades',
        buttons: [
          {
            label: 'Delete',
            action: cancelCoaster
          }
        ]
      })
    },

    repost () {
      const repostIt = () => {
        this.$store.dispatch('repostCoaster', this.coaster)
        this.$store.commit('CLOSE_MODAL')
      }
      this.$store.commit('SHOW_MODAL', {
        component:'Confirmation',
        heading: 'Confirm Repost',
        message: 'You are responsible for this shift until someone else picks it up.',
        buttons: [
          {
            label: 'I understand',
            action: repostIt,
            classList: 'is-primary'
          }
        ]
      })
    },

    cancelCoaster () {

      let cancelCoaster = () => {
        this.$store.dispatch('cancelCoaster', this.coaster)
        this.$store.commit('CLOSE_MODAL')
        if (this.$store.state.route.name === 'detail') router.push({name: 'home'})
      }

      this.$store.commit('SHOW_MODAL', {
        component:'Confirmation',
        heading: 'Take Down Shift',
        message: 'Are you sure you want to remove this post?',
        buttons: [
          {
            label: 'Take Down',
            action: cancelCoaster,
            classList: 'is-primary'
          }
        ]
      })

    },

    dateCommentPosted (dateString) {
      return moment(dateString).fromNow()
    }

  }



}
</script>

<style lang="scss">
.detail {
  .header {
    font-size: 1.6em;
    margin-bottom: .6em;
  }
  .section-title {
    font-size: 1.4em;
    margin: .3em 0;
  }

  .top-level-comment {
    padding-bottom: 1.2em;
    display: flex;
    .comment {
      width: 90%;
    }
  }

  .coaster-actions {
    color: red !important;
    white-space: nowrap;
    .button {
      margin-top: .4em;
    }
  }
  .card-footer-item { display: inline-block; }

  .isCommenting .card-footer-item { justify-content: space-around; }
  // .top-level-comment { padding-bottom: 1em; }
  .comment-button {
    color: #45494d;
  }
  .flag-button {
    margin-right: .55em;
    &.flagged {
      color: #a02020;
    }
  }
  .isCommenting .comment-button {
    color: #4679c7;
  }
  .comment-container {
    display: flex;
    align-items: flex-start;
    padding: .25em 0;
    // border-top: 1px solid #dbdbdb;
    .commenting-user {
      display: inline-flex;
      flex-shrink: 0;
      margin-top: .3em;
      margin-right: .8em;
      img {
        object-fit: cover;
        object-position: center;
      }
    }
  }

}
</style>
