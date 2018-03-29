<template lang="html">
  <div class="post-single">
    <div class="form">
      <div v-if="!!shouldBeRepostOf" class="repost-warning warning">
        This shift matches one you picked up. Please repost
        <router-link :to="'/coasters/' + shouldBeRepostOf">that shift</router-link> instead.
      </div>
      <div v-if="!!isDupeOf" class="repost-warning warning">
        Whoops. Looks like you've already posted
        <router-link :to="'/coasters/' + isDupeOf">this shift</router-link>.
      </div>
      <div v-if="postAsUser.displayName" class="control posting-as">
        <span class="text">
          Posting As: {{ postAsUser.displayName }}
        </span>
        <span @click="cancelPostAs" class="fa fa-times"/>
      </div>
      <p class="control">
        <Datepicker v-model="date" :format="'D, MMM dsu'" :disabled="disabledDates"/>
      </p>
      <p class="control">
        <span class="select">
          <select v-model="shiftType">
            <option value="Serve">Serve</option>
            <option value="Bus">Bus</option>
            <option value="Barback">Bar back</option>
            <option value="Bartend">Bartend</option>
            <option value="Host">Host</option>
          </select>
        </span>
      </p>
      <p class="control">
        <span class="button" :class="{ 'is-active': isAM }" @click="time = 'AM'">AM</span>
        <span class="button" :class="{ 'is-active': isPM }" @click="time = 'PM'">PM</span>
      </p>
      <span
        v-if="$store.getters.isAdmin"
        class="button control post-as-button"
        @click="choosePostAsUser">
        Post As &nbsp;
        <span class="fa fa-user"/>
      </span>
      <p class="control">
        <textarea class="textarea" v-model="comment" placeholder="Comments or additional information"/>
      </p>
    </div>

    <button class="button submit-button" :disabled="!!shouldBeRepostOf || !!isDupeOf" @click="newCoaster">Submit</button>

  </div>
</template>

<script>

import { moment } from '../libs'
import router from '../router'


// Child components
import Datepicker from 'vuejs-datepicker'


export default {

  components: {
    Datepicker
  },
  data () {
    return {
      date: new Date(), //moment().format('YYYY-MM-DD'), // add(1, 'day')
      time: 'AM',
      shiftType: 'Serve',
      comment: '',
      postAsUser: {}
    }
  },

  computed: {
    shouldBeRepostOf () {
      return this.getDupeFromList(this.$store.state.userData.holding)
    },
    isDupeOf () {
      return this.getDupeFromList(this.$store.state.userData.posted)
    },
    myDate () {
      return moment(this.date).format('YYYY-MM-DD')
    },
    isAM () {
      return this.time === 'AM'
    },
    isPM () {
      return this.time === 'PM'
    },
    disabledDates () {
      return {to: moment().subtract(1, 'days').toDate()}
    }
  },

  methods: {

    newCoaster () {
      this.$store.commit('SET_LOADING_STATE', true)

      this.$store.dispatch('newCoaster', {
          date:         this.myDate,
          time:         this.time,
          shiftType:    this.shiftType,
          comment:      this.comment,
          postedAsUser: this.postAsUser ? this.postAsUser : null
      }).then(
        () => {
          router.push({
            name: 'user',
            params: {
              uid: this.$store.state.authState.user.uid
            }
          })
          this.$store.commit('SET_LOADING_STATE', false)
        }, () => { alert('Something appears to have gone wrong. Please refresh and try again')}

      )

    },
    getDupeFromList (list) {
      if (!list) return
      const dupes = Object.keys(list).filter((key) => {
        const coaster = list[key]
        return coaster.shiftType === this.shiftType
          && coaster.date === moment(this.date).format('YYYY-MM-DD')
          && coaster.time === this.time
          && !coaster.inactive
      })
      return dupes && dupes[0]
    },
    choosePostAsUser () {
      this.$store.commit('SHOW_MODAL', {component: 'Loading'})

      this.$store.dispatch('getPromisedUsers').then(() => {
        // this.$store.commit('CLOSE_MODAL')
        this.$store.commit('SHOW_MODAL', {component: 'UserSearch', props: {
          coaster: this.coaster,
          onUserClick: (user) => {
            console.log('onUserClick . . .');
            this.postAsUser = user
            this.$store.commit('CLOSE_MODAL')
          }
         }
       })
      })
    },

    cancelPostAs () {
      this.postAsUser = {}
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '../../node_modules/bulma/sass/utilities/mixins.sass';
  .post-single {
  .warning { color: red; }

    border: 1px solid grey;
    padding: 1.4em;
    margin-bottom: 6em;

    .repost-warning {
      margin-bottom: .6em;
      a {
        color: red;
        text-decoration: underline;
      }
    }
    .posting-as {
      color: red;
      display: flex;
      justify-content: space-between;
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

    .post-as-button {
      .fa { color: rgb(66, 66, 66); }
    }

    .submit-button { margin-top: 10px; }
    .vdp-datepicker input[type='text'] {
      -moz-appearance: none;
      -webkit-appearance: none;
      align-items: center;
      background-color: white;
      border: 1px solid #dbdbdb;
      border-radius: 3px;
      color: #363636;
      display: inline-flex;
      font-size: 14px;
      height: 32px;
      justify-content: flex-start;
      line-height: 24px;
      padding-left: 8px;
      padding-right: 8px;
      position: relative;
      vertical-align: top;
      box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
    }

  }
  html {}
</style>
