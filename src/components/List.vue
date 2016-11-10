<template lang="html">
  <div class="list">
    <span class="header">Available Shifts</span>
    <button @click="reverseList">Reverse</button>
    <span class="days">

    <button @click="setDayFilter" class="dayOfWeek">S</button>
    <button @click="setDayFilter" class="dayOfWeek">M</button>
    <button @click="setDayFilter" class="dayOfWeek">T</button>
    <button @click="setDayFilter" class="dayOfWeek">W</button>
    <button @click="setDayFilter" class="dayOfWeek">R</button>
    <button @click="setDayFilter" class="dayOfWeek">F</button>
    <button @click="setDayFilter" class="dayOfWeek">S</button>

    </span>
    <ul>
      <coaster v-for="coaster in filteredCoasters" :coaster="coaster" as:="'LIST'"></coaster>
    </ul>
  </div>

</template>

<script>
import Coaster from './Coaster.vue'
import bus from '../bus'
import _ from 'underscore'

export default {
  props: ['coasters'],
  data () {
    return {
      order: 'ASC'
    }
  },
  computed: {
    filteredCoasters () {
      if (this.order === 'ASC') {
        return _.sortBy(this.coasters, '.key').reverse()
      }
      else {
        return _.sortBy(this.coasters, '.key')
      }
    }
  },
  created: function () {
    this.$on('remove', function () {
      console.log('an event!');
    })
  },
  methods: {
    reverseList () {
      console.log(this.coasters);
      this.order = (this.order === 'ASC') ? 'DESC' : 'ASC'
    },
    setDayFilter (event) {
        let getElemIndex = (node) => {

        }
        console.log(event.target.innerText);
    }

  },
  components: {
    Coaster
  }
}
</script>

<style lang="scss">
span.message {
  color: red;
}
</style>
