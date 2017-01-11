<template lang="html">
  <div class="new">
    <h3>{{test}}</h3>
    <div class="form">
      <Flatpickr @update="pickDate" :value="datePickerMsg" />
      <!-- <datepicker v-model="date" :config="{static: true}"></datepicker> -->
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
      <span :class="{ 'is-active': isAM }" class="button" @click="time = 'AM'">AM</span>
      <span :class="{ 'is-active': isPM }" class="button" @click="time = 'PM'">PM</span>

      <textarea v-model="comment" class="textarea"></textarea>
      <span>{{myDate }}</span>
    </div>
    <button @click="newCoaster" class="button">Submit</button>
  </div>
</template>

<script>

import { moment } from '../libs'
import router from '../router'


// Child components
import Flatpickr from 'vue-flatpickr/vue-flatpickr-airbnb.vue'


export default {

  data () {
    return {
      datePickerMsg: '2017-01-19',
      date: moment().format('YYYY-MM-DD'),
      time: '',
      shiftType: 'Serve',
      comment: 'Lorem ipsum shift comments that are super awesome',
    }
  },
  props: ['test'],

  computed: {
    myDate () {
      return moment(this.date).format('YYYY-MM-DD')
    },
    isAM () {
      return this.time === 'AM'
    },
    isPM () {
      return this.time === 'PM'
    }
  },
  components: {
    Flatpickr
  },
  methods: {
    pickDate (val) {
      // this.datePickerMsg = val
      this.date = val
    },
    newCoaster () {
      this.$store.dispatch('newCoaster', {
          date: this.myDate,
          time: this.time,
          shiftType: this.shiftType,
          comment: this.comment,
          pickedUp: false,
          postedBy: {
            uid: this.$store.state.authState.user.uid,
            displayName: this.$store.state.authState.user.displayName,
            photoURL: this.$store.state.authState.user.photoURL,
          }
      })
      router.push({path: '/'})
      // TODO: only redirect on successful persist
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  .new {
    border: 1px solid grey;
    padding: 1.4em;
    margin-bottom: 6em;
  }
  html {}
</style>
