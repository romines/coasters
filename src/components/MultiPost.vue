<template>

  <form class="multi-post" @submit.prevent="submitPending">

    <div v-if="duplicateShifts.length" class="dupe-warnings warning">
      One or more of the shifts below matches a shift you've picked up. Please repost instead.

      <router-link
        v-for="shift in duplicateShifts"
        class="dupe-link"
        :to="'/coasters/' + shift"
        :key="shift">[duplicate shift]</router-link>

    </div>

    <div v-if="postAsUser.displayName" class="control posting-as">
      <span class="text">
        Posting As: {{ postAsUser.displayName }}
      </span>
      <span class="fa fa-close" @click="cancelPostAs" />
    </div>
    <div class="title-bar item-row" @click="newPendingShift">
      <span class="text">Add Shift</span>
      <i class="fa fa-plus"/>
    </div>

    <div
      v-for="shift in shiftsPending"
      class="shift item-row"
      :key="shift.key"
      :class="!!shouldBeRepostOf(shift) ? 'warning' : ''">

      <span class="date">
        <Datepicker
          v-model="shift.date"
          :format="'D, MMM dsu'"
          :disabled="disabledDates"
          :wrapper-class="'datepicker-wrapper'"/>
      </span>

      <span class="shift-type-and-time">
        <span class="time">
          <select v-model="shift.time">
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </span>
        <span class="shift-type">
          <select v-model="shift.shiftType">
            <option value="Serve">Serve</option>
            <option value="Bus">Bus</option>
            <option value="Barback">Bar back</option>
            <option value="Bartend">Bartend</option>
            <option value="Host">Host</option>
          </select>
        </span>
      </span>
    </div>

    <span
      v-if="$store.getters.isAdmin"
      class="button control post-as-button"
      @click="choosePostAsUser">
      Post As &nbsp;
      <span class="fa fa-user"/>
    </span>

    <textarea v-model="comment" class="textarea" placeholder="Comments or additional information"/>
    <!-- <span
      @click="choosePostAsUser"
      v-if="$store.getters.isAdmin"
      class="button control post-as-button">
      Post As &nbsp;
      <span class="fa fa-user"></span>
    </span>     -->
    <input type="submit" class="button submit-button" value="Submit" :disabled="!!duplicateShifts.length">

  </form>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import router from '../router'

export default {
  components: {
    Datepicker
  },
  data() {
    return {
      picking: false,
      shiftsPending: [],
      comment: '',
      postAsUser: {}
    }
  },
  computed: {
    disabledDates() {
      return { to: moment().subtract(1, 'days').toDate() }
    },
    duplicateShifts () {
      return this.shiftsPending.map(this.shouldBeRepostOf).filter(shift => !!shift)
    }
  },
  methods: {
    newPendingShift() {
      let newShift = {
        date: new Date(),
        time: 'AM',
        shiftType: 'Serve',
        comment: '',
        key: new Date().getTime() + '',
        postedAsUser: this.postAsUser ? this.postAsUser : null
      }
      this.shiftsPending.push(newShift)
    },
    submitPending() {
      let postShift = shift => this.$store.dispatch('newCoaster', shift)

      let pending = this.shiftsPending.map((shift) => {
        shift.date = moment(shift.date).format('YYYY-MM-DD')
        shift.comment = this.comment
        return shift
      }).map(postShift)

      Promise.all(pending).then(
        () => {
          router.push({
            name: 'user',
            params: {
              uid: this.$store.state.authState.user.uid
            }
          })
        }, () => { alert('Something appears to have gone wrong. Please refresh and try again') }
      )
    },
    choosePostAsUser () {
      this.$store.commit('SHOW_MODAL', {component: 'Loading'})

      this.$store.dispatch('getPromisedUsers').then(() => {
        this.$store.commit('SHOW_MODAL', {component: 'UserSearch', props: {
          onUserClick: (user) => {
            this.postAsUser = user
            this.shiftsPending.map(shift => shift.postedAsUser = user)
            this.$store.commit('CLOSE_MODAL')
          }
         }
       })
      })
    },
    cancelPostAs () {
      this.postAsUser = {}
    },
    shouldBeRepostOf (shift) {
      let coastersHeld = this.$store.state.userData.holding ? this.$store.state.userData.holding : {}
      let dupes = Object.keys(coastersHeld).filter((key) => {
        return coastersHeld[key].shiftType === shift.shiftType && coastersHeld[key].date === moment(shift.date).format('YYYY-MM-DD') && coastersHeld[key].time === shift.time && !coastersHeld[key].inactive
      })
      return dupes && dupes[0]
    },
    getFormattedDate(dt) {
      return moment(dt).format('MM-DD')
    }
  },
}
</script>

<style lang="scss">
@import '../../node_modules/bulma/sass/utilities/mixins.sass';

.multi-post {
  .dupe-warnings {
    margin-bottom: .6em;
    color: red;
    a {
      color: red;
      text-decoration: underline;
      display: block;
    }
  }
  .posting-as {
    color: red;
    display: flex;
    justify-content: space-between;
  }

  .item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid lightgray;
    padding: .6em .75em;
    margin-bottom: .43em;
    &.warning { border: 1px solid red; }
    &.title-bar {
      i {
        font-size: 18px;
        opacity: .9;
      }
    }
    &.shift {
      .date .vdp-datepicker {
        // & > div { width: 10em; }
        input {
          border: none;
          width: 10em;
          color: #4a4a4a;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.428571428571429;
        }
      }
      .shift-type-and-time {
        select {
          background-color: transparent;
          border: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          text-indent: 1px;
          // text-overflow: '';
          color: #4a4a4a;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.428571428571429;
        }
        .shift-type {
          margin-left: 2em;
        }
      }
    }
  }
  @include mobile {
    .vdp-datepicker__calendar {
      width: 96%;
      position: fixed;
      top: 20vh;
      left: 2%;
      z-index: 101;
    }
  }
  .submit-button {
    margin-top: .4em;
  }
}
</style>