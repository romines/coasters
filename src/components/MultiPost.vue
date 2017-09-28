<template>
  <div class="multi-post">
    <div class="title-bar item-row" @click="newPendingShift">
      <span class="text">Add Shift</span>
      <i class="fa fa-plus"></i>
    </div>

    <div class="shift item-row" v-for="shift in shiftsPending" :key="shift.key">
      <span class="date">
        <Datepicker 
          v-model="shift.date" 
          :format="'D, MMM dsu'" 
          :disabled="disabledDates" 
          :wrapper-class="'datepicker-wrapper'"></Datepicker>
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

    <textarea v-model="comment" class="textarea" placeholder="Comments or additional information"></textarea>
    
    <button @click="submitPending" class="button submit-button">Submit</button>

  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'
import router from '../router'

export default {
  data() {
    return {
      shiftsPending: [],
      comment: ''
    }
  },
  components: {
    Datepicker
  },
  methods: {
    newPendingShift() {
      let newShift = {
        date: new Date(),
        time: 'AM',
        shiftType: 'Serve',
        comment: '',
        key: new Date().getTime() + '',
        postAsUser: {}
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
              key: this.$store.state.authState.user.uid
            }
          })
        }, () => { alert('Something appears to have gone wrong. Please refresh and try again') }
      )
    }
  },
  computed: {
    disabledDates() {
      return { to: moment().subtract(1, 'days').toDate() }
    }
  }
}
</script>

<style lang="scss">
@import '../../node_modules/bulma/sass/utilities/mixins.sass';

.multi-post {
  .item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid lightgray;
    padding: .6em .75em;
    margin-bottom: .43em;
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
          text-overflow: '';
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
      width: 100%;
      position: fixed;
      left: 0;
    }
  }
}
</style>