<template lang="html">
  <div class="new">
    <h3>{{test}}</h3>
    <div class="form">
      <input type="date" v-model="date">
      <select v-model="shiftType">
        <option value="Serve">Serve</option>
        <option value="Bus">Bus</option>
        <option value="Barback">Bar back</option>
        <option value="Bartend">Bartend</option>
        <option value="Host">Host</option>
      </select>
      <select class="" v-model="time">
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
      <br>
      <textarea v-model="comment"></textarea>
      <span>{{myDate}}</span>
    </div>
    <button @click="newCoaster">Submit</button>
  </div>
</template>

<script>
//
// Should encompass <list> and <coaster>, which is hidden with styles on mobile
//
import bus from '../bus'
import moment from 'moment'
export default {
  data () {
    return {
      date: '2016-01-01',
      time: 'AM',
      shiftType: 'Serve',
      comment: 'how many',
    }
  },
  props: ['test'],
  computed: {
    myDate () {
      return moment(this.date).format('YYYY-MM-DD')
    }
  },
  methods: {
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
