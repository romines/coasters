<template lang="html">
  <div class="new">
    <h3>Create a new coaster</h3>
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
    <textarea v-model="comment"></textarea>
    <button @click="newCoaster">Submit</button>
  </div>

</template>

<script>
import bus from '../bus'
export default {
  data () {
    return {
      date: '2016-01-01',
      time: 'AM',
      shiftType: 'Serve',
      comment: 'Somebody please help me!',

    }
  },
  created () {
  },
  computed: {
    reversedMessage () {
      return this.message.split('').reverse().join('')
    }
  },
  methods: {
    newCoaster () {
      console.log('trying..');
      bus.$emit('new-coaster', {
          date: this.date,
          time: this.time,
          shiftType: this.shiftType,
          comment: this.comment
      })
      // TODO: clear fields
    }
  }
}
</script>

<style lang="scss">
  textarea {
    display: block;
  }
  html {}
</style>
