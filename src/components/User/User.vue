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
        <coaster
          :options="{}"
          v-for="coaster in myPostedCoasters"
          :coaster="coaster"
          :key="coaster.key">

          <div slot="notice" class="notices">
            <div v-if="isReposted(coaster)" class="warn">
              REPOSTED
            </div>
            <div v-if="!!pickedUpBy(coaster)" class="success">
              PICKED UP BY: {{pickedUpBy(coaster)}}
            </div>
          </div>

        </coaster>

      </ul>
    </section>

    <section class="posted-shifts">
      <span class="title is-5">Shifts I'm Covering</span>
      <ul>
        <coaster
          :options="{}"
          v-for="coaster in myPickedUpCoasters"
          :coaster="coaster"
          :key="coaster.key">
            <div slot="notice" class="notices">
              <div v-if="isReposted(coaster)" class="warn">
                REPOSTED
              </div>
              <div v-if="!!pickedUpBy(coaster)" class="success">
                PICKED UP BY: {{pickedUpBy(coaster)}}
              </div>
            </div>
          </coaster>
      </ul>
    </section>

  </div>
</template>

<script>
import List from '../List.vue'
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
      if (!this.$store.state.userData.posted) return
      return Object.keys(this.$store.state.userData.posted).filter((key) => {
        return this.withinDateRange(this.$store.state.userData.posted[key])
      })
    },

    myPickedUpCoasters () {
      if (!this.$store.state.userData.holding) return
      return Object.keys(this.$store.state.userData.holding).filter((key) => {
        return this.withinDateRange(this.$store.state.userData.holding[key])
      })
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
    }


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
  .media img {
    width: 74px;
    height: 74px;
    object-fit: cover;
  }
  .media-left {
    max-width: 50%;
  }
  .notices {
    .warn { color: red; }
    .success { color: green; }
  }
  .posted-shifts {
    padding-top: 1em;
    margin-top: 1em;
    border-top: 1px solid rgb(117, 117, 117);
  }


}
</style>
