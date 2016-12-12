<template lang="html">
  <div class="new">
    <h3>{{test}}</h3>
    <div class="form">
      <Flatpickr @update="pickDate" :message="datePickerMsg" />
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
//
// Should encompass <list> and <coaster>, which is hidden with styles on mobile
//
import bus from '../bus'
import moment from 'moment'
import Flatpickr from 'vue-flatpickr/vue-flatpickr-airbnb.vue'
export default {
  data () {
    return {
      datePickerMsg: 'Date . . .',
      date: '2016-01-01',
      time: '',
      shiftType: 'Serve',
      comment: 'how many',
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
      console.log({
          date: this.myDate,
          time: this.time,
          shiftType: this.shiftType,
          comment: this.comment
      });

      bus.$emit('new-coaster', {
          date: this.myDate,
          time: this.time,
          shiftType: this.shiftType,
          comment: this.comment
      })
      // TODO: clear fields
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
