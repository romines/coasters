<template lang="html">
  <div v-if="user" class="user container">
    <div class="title header">
      <span class="text">My Coasters</span>
      <i @click="logOut" class="fa fa-power-off"></i>
    </div>

    <div class="media">
      <div class="media-left">
        <figure class="user">
          <image-upload>
            <span slot="title"></span>
          </image-upload>

        </figure>
      </div>

      <div class="media-content">
        <ul>
          <li>{{user.displayName}}</li>
          <li>{{user.email}}</li>
          <!-- <li><a @click="logOut">Log out</a></li> -->
        </ul>
      </div>
    </div>

    <section class="notifications">
      <div v-for="notification in notifications" :key="notification.key" class="notification is-primary">
        <button @click="dismiss(notification.key)" class="delete"></button>
        <span v-html="notification.message" class="notieLink"></span>
      </div>
    </section>

    <section class="posted-shifts">
      <span class="title is-5">Posted Shifts</span>
      <ul>
        <!-- <template v-if="myPostedCoasters.length"> -->
          <coaster
            :options="{ hideFor: true }"
            v-for="coaster in myPostedCoasters"
            :coaster="coaster"
            :key="coaster.key">

          <div slot="notice" class="notices">
            <div v-if="isRepostedByMe(coaster)" class="info">
              REPOST
            </div>
            <div v-if="!!pickedUpBy(coaster)" class="success">
              PICKED UP BY: {{pickedUpBy(coaster)}}
            </div>
          </div>

        </coaster>
      <!-- </template> -->

      </ul>
    </section>

    <section class="posted-shifts">
      <span class="title is-5">Shifts I'm Covering</span>
      <ul>
        <!-- <template v-if="myPickedUpCoasters"> -->
          <coaster
            :options="{}"
            v-for="coaster in myPickedUpCoasters"
            :coaster="coaster"
            :key="coaster.key">
            <div slot="main">
              <div class="posted-by media">
                <div class="media-left">
                  <figure class="user">
                    <img v-if="coaster.postedBy.photoURL" :src="coaster.postedBy.photoURL" alt="">
                    <span v-if="!coaster.postedBy.photoURL" class="icon is-large">
                      <i class="fa fa-user"></i>
                    </span>
                  </figure>
                </div>

                <div class="media-content">
                  <ul>
                    <li>{{getLongDateString(coaster.date)}}</li>
                    <li><strong>{{coaster.time + ' ' + coaster.shiftType}}</strong></li>
                    <li>for <strong>{{coaster.postedBy.name}}</strong></li>
                    <!-- <li><small>[when picked up?]</small></li> -->
                  </ul>
                  <span class="desktop-comments">{{ coaster.comment }}</span>
                </div>
              </div>
            </div>
            <div slot="notice" class="notices">
              <div v-if="isReposted(coaster)" class="warn">
                ON YOU
              </div>
              <div v-if="isReposted(coaster)" class="info">
                REPOSTED
              </div>

            </div>
          </coaster>

        <!-- </template> -->
      </ul>
    </section>

  </div>
</template>

<script>
import Coaster from '../Coaster/Coaster.vue'
import ImageUpload from '../widgets/ImageUpload.vue'
import router from '../../router'
import moment from 'moment'


export default {
  data () {
    return {
      beginning: moment()
    }
  },
  computed: {
    user () {
      return this.$store.state.authState.user
    },

    notifications () {
      return this.$store.state.notifications.filter(notification => notification.status === 'unread')
    },

    myPostedCoasters () {

      if (!this.$store.state.userData.posted) return []
      return Object.keys(this.$store.state.userData.posted).map((key) => {
        let coaster = this.$store.state.userData.posted[key]
        coaster.key = key
        return coaster
      })
      .filter(coaster => !coaster.inactive)
      .filter(this.notCancelledRepost)
      .filter(this.withinDateRange)
    },

    myPickedUpCoasters () {
      if (!this.$store.state.userData.holding) return
      return Object.keys(this.$store.state.userData.holding).map((key) => {
        let coaster = this.$store.state.userData.holding[key]
        coaster.key = key
        return coaster
      })
      .filter(coaster => !coaster.inactive)
      .filter(this.withinDateRange)
      .filter(this.hasHistory)
    }
  },

  components: {
    Coaster,
    ImageUpload
  },

  methods: {
    logOut () {
      router.push('/')
      this.$store.dispatch('logOutUser')
    },
    dismiss (key) {
      this.$store.dispatch('dismissNotification', key)
    },
    isReposted (coaster) {
      if (!coaster.history) return
      return coaster.heldBy.uid === coaster.postedBy.uid
    },
    isRepostedByMe (coaster) {
      if (!coaster.history) return
      return this.isReposted(coaster) && coaster.heldBy.uid === this.user.uid
    },
    notCancelledRepost (coaster) {
      if (!coaster.history) return true;
      const historyKeys = Object.keys(coaster.history).sort()
      const getMyRepostIndex = (index) => {
        if (index >= 0) {
          let historyItem = coaster.history[historyKeys[index]]
          if (historyItem.type === 'REPOST' && historyItem.committedBy.uid === this.user.uid) {
            return index
          } else {
            return getMyRepostIndex(index - 1);
          }
        } else {
          console.log('Not found');
          return -1;
        }
      }
      // Work backwards through history to find
      const myRepostIndex = getMyRepostIndex(historyKeys.length-1)
      if (myRepostIndex > -1 && coaster.history[historyKeys[myRepostIndex + 1]]) {
        return coaster.history[historyKeys[myRepostIndex + 1]].type !== 'CANCEL';
      } else {
        return true;
      }
    },
    pickedUpBy (coaster) {
      if (coaster.heldBy.uid === this.user.uid) return false
      else {
        return coaster.heldBy.name
      }
    },
    withinDateRange (coaster) {
      let coasterMoment = moment(coaster.date)
      let beginningMoment = moment(this.beginning)
      return (coasterMoment.diff(beginningMoment, 'days') >= 0)
    },

    hasHistory (coaster) {
      if (!coaster.history) return
      return Object.keys(coaster.history).length
    },

    getLongDateString (date) {
      return moment(date).format('dddd, MMM Do')
    }

  }

}

function withinDateRange (coaster, beginning) {
  let coasterMoment = moment(coaster.date)
  let beginningMoment = moment(beginning)
  let diff = coasterMoment.diff(beginningMoment, 'days')
  let truthy = (coasterMoment.diff(beginningMoment, 'days') >= 0)
  console.log({coasterMoment, beginningMoment, diff, truthy});
  return (coasterMoment.diff(beginningMoment, 'days') >= 0)
  // return true
}
</script>

<style lang="scss">
.user {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .notieLink a {
    color: white;
    text-decoration: underline;
  }
  .media img, .coaster .media-left figure.user img, .coaster .media-left figure.user .icon {
    width: 74px;
    height: 74px;
    object-fit: cover;
  }
  .media-left {
    max-width: 50%;
  }

  .posted-shifts {
    padding-top: 1em;
    margin-top: 1em;
    border-top: 1px solid rgb(117, 117, 117);
  }


}
</style>
