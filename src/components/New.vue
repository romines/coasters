<template lang="html">
  <div class="new">
    <h3>Create a new coaster</h3>
    <input type="date" v-model="date">
    <select v-model="shiftType">
      <option value="Serve">Serve</option>
      <option value="Bus">Bus</option>
      <option value="Bar Back">Bar back</option>
      <option value="Bartend">Bartend</option>
      <option value="Host">Host</option>
    </select>
    <select class="" v-model="time">
      <option value="AM">AM</option>
      <option value="PM">PM</option>
    </select>
    <textarea v-model="comment"></textarea>
    <button @click="bubble">Submit</button>
  </div>

</template>

<script>
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
    console.log('new component in the house');
  },
  computed: {
    reversedMessage () {
      return this.message.split('').reverse().join('')
    }
  },
  methods: {
    bubble () {
      console.log('got this far..');
      this.$emit('new', [
        event.target,
        { date: this.date,
          time: this.time,
          shiftType: this.shiftType,
          comment: this.comment }
      ])
    }
  }
}
</script>

<style lang="css">
  textarea {
    display: block;
  }
  html {}
</style>
