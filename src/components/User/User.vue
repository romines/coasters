<template lang="html">
  <div v-if="user" class="user container">
    <div class="title header">
      <span class="text">My Coasters</span>
      <i @click="logOut" class="fa fa-power-off"/>
    </div>

    <div class="media user-profile">
      <div class="media-left">
        <div class="user-image image-container">
          <img v-if="user.photoURL" class="user-photo" :src="user.photoURL">
          <div v-if="!user.photoURL" class="user-icon placeholder" @click="addPhoto">
            <i class="fa fa-user" />
            <div class="add-photo-text">
              Add Photo
            </div>
          </div>
        </div>
      </div>

      <div class="media-content">
        <ul>
          <li>{{ user.displayName }}</li>
          <li>{{ user.email }}</li>
          <li v-show="!user.sms && !addingSMS" class="add-sms">
            <div v-show="!addingSMS" class="prompt" @click="beginSmsEdit">
              <span class="link">Get text notifications</span>
              <span class="new-notice">NEW!</span>
            </div>
          </li>
          <li v-show="user.sms && !addingSMS" class="sms">{{ user.sms }}
            <span class="icon is-small" @click="beginSmsEdit"><i class="fa fa-pencil-alt" /></span>
          </li>
          <li v-show="addingSMS">
            <div class="sms-mini-form">
              <cleave
                class="input"
                placeholder="Enter US Mobile #"
                v-model="localState.sms"
                :class="{ 'is-danger': !phoneIsValid(localState.sms)}"
                :options="cleaveOptions" />
              <span class="icon save-icon"
                :disabled="!phoneIsValid(localState.sms)"
                @click="saveSMS">
                <i class="fa fa-save" />
              </span>
              <span class="icon cancel-icon"
                @click="addingSMS = false">
                <i class="fa fa-times" />
              </span>
            </div>
          </li>
        </ul>
      </div>

    </div>
    <div v-show="showSmsSuccess" class="sms-success is-small">Mobile number saved successfully.</div>

    <section class="notifications">
      <div v-for="notification in notifications" class="notification is-primary" :key="notification.key">
        <button class="delete" @click="dismiss(notification.key)" />
        <span class="notieLink" v-html="notification.message"/>
      </div>
    </section>

    <section class="posted-shifts">
      <div class="title is-4 section-headers">Posted Shifts</div>
      <ul>
        <coaster
          v-for="coaster in myPostedCoasters"
          :options="{ hideFor: true }"
          :coaster="coaster"
          :key="coaster.key">

          <div class="notices" slot="notice">
            <div v-if="isRepostedByMe(coaster)" class="info">
              REPOST
            </div>
            <div v-if="!!pickedUpBy(coaster)" class="success">
              PICKED UP BY: {{ pickedUpBy(coaster) }}
            </div>
          </div>

        </coaster>

      </ul>
    </section>

    <section class="posted-shifts">
      <div class="title is-4 section-headers">Shifts I'm Covering</div>
      <ul>
        <coaster
          v-for="coaster in myPickedUpCoasters"
          :options="{}"
          :coaster="coaster"
          :key="coaster.key">
          <div slot="main">
            <div class="posted-by media">
              <div class="media-left">
                <figure class="user">
                  <img v-if="coaster.postedBy.photoURL" :src="coaster.postedBy.photoURL">
                  <span v-if="!coaster.postedBy.photoURL" class="icon is-large">
                    <i class="fa fa-user"/>
                  </span>
                </figure>
              </div>

              <div class="media-content">
                <ul>
                  <li>{{ getLongDateString(coaster.date) }}</li>
                  <li><strong>{{ coaster.time + ' ' + coaster.shiftType }}</strong></li>
                  <li>for <strong>{{ coaster.postedBy.name }}</strong></li>
                  <!-- <li><small>[when picked up?]</small></li> -->
                </ul>
                <span class="desktop-comments">{{ coaster.comment }}</span>
              </div>
            </div>
          </div>
          <div class="notices" slot="notice">
            <div v-if="isReposted(coaster)" class="warn">
              ON YOU
            </div>
            <div v-if="isReposted(coaster)" class="info">
              REPOSTED
            </div>

          </div>
        </coaster>

      </ul>
    </section>

  </div>
</template>

<script>
import Cleave from 'vue-cleave-component'
// import PhoneNumber from 'awesome-phonenumber'
import 'cleave.js/dist/addons/cleave-phone.us.js'
import Coaster from '../Coaster/Coaster.vue'
import ImageUpload from '../widgets/ImageUpload.vue'
import router from '../../router'
import moment from 'moment'
import mixins from '../../mixins'

export default {

  components: {
    Coaster,
    Cleave,
    ImageUpload
  },
  mixins: [mixins],
  data () {
    return {
      beginning: moment(),
      addingSMS: false,
      showSmsSuccess: false,
      localState: {
        sms: null
      },
      cleaveOptions: {
        phone: true,
        phoneRegionCode: 'US',
        // prefix: '(',
        blocks: [1, 3, 3, 4],
        delimiters: ['.', '.', '-'],
      }
    }
  },
  computed: {
    user () {
      return this.$store.state.userData
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
      .sort(this.sortByTime)
      .sort(this.sortByDate)
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
      .sort(this.sortByTime)
      .sort(this.sortByDate)
    }
  },

  methods: {
    logOut () {
      router.push('/')
      this.$store.dispatch('logOutUser')
    },
    addPhoto () {
      this.$store.commit('SHOW_MODAL', {
        component: 'ImageUpload',
        heading: 'Add Photo',
        // onSuccess: () => {}
      })
    },
    beginSmsEdit () {
      this.localState.sms = this.user.sms ? this.user.sms : ''
      this.addingSMS = true
    },
    saveSMS () {
      this.$store.dispatch('saveSMS', this.localState.sms.replace(/ /g, '')).then(() => {
        this.addingSMS = false
        this.showSmsSuccess = true
        setTimeout(() => {
          this.showSmsSuccess = false
        }, 3200)
      })
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
    },
    phoneIsValid (sms) {
      if (sms) {
        const withoutSpaces = sms.replace(/ /g, '')
        console.log(withoutSpaces)
        return withoutSpaces.length === 10 || withoutSpaces.length === 11
      }
    },

  }

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
  .user-profile {
    align-items: stretch;
    .image-container {
      max-width: 26vw;
      margin-bottom: 0;
      .user-photo, .user-icon {
        width: 104px;
        height: 104px;
        object-fit: cover;
      }
      .user-icon i.fa {
        font-size: 77px;
        line-height: 77px;
      }
    }
    .media-content {
      display: inline-flex;
      align-items: center;
      li:not(.add-sms) {
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 57vw;
      }
      li.sms {
        display: flex;
        align-items: center;
        span.icon { margin-left: .6em; }
      }
      .add-sms {
        .link {
          text-decoration: underline;
        }
        .new-notice { // temp
          color: red;
          border: 1px solid red;
          // margin-left: .3em;
          padding: .1em;
          font-size: .83em;
        }
      }
      .sms-mini-form {
        display: flex;
        align-items: center;
        input {
          width: 120px;
          margin-right: 1vw;
        }

        .icon {
          padding-top: 4px;
          width: 8.2vw;
          // display: inline-block;
          vertical-align: middle;
          margin-left: .2em;
          font-size: 18px;
          height: 32px;
          &[disabled] { opacity: .6 }
        }
      }
    }
    .sms-success { color: green; }
  }
  // .media img, .coaster .media-left figure.user img, .coaster .media-left figure.user .icon {
  //   width: 74px;
  //   height: 74px;
    // object-fit: cover;
  // }
  .media-left {
    max-width: 50%;
  }
  .section-headers { margin-bottom: 15px; }
  .posted-shifts {
    padding-top: 1em;
    margin-top: 1em;
    border-top: 1px solid rgb(117, 117, 117);
  }


}
</style>
