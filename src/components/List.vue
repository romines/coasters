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
      <img @click="dayNumber = -1" class="close" :src="loadSvg('close')" />
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
import moment from 'moment'
import mixins from '../mixins'

export default {
  props: ['coasters'],
  data () {
    return {
      order: 'ASC',
      dayNumber: -1
    }
  },
  mixins: [mixins],
  computed: {
    filteredCoasters () {
      let filteredByDay = this.coasters.filter((coaster) => {
        if (this.dayNumber < 0) return true
        return moment(coaster.date).day() === this.dayNumber
      })

      if (this.order === 'ASC') {
        return _.sortBy(filteredByDay, '.key').reverse()
      }
      else {
        return _.sortBy(filteredByDay, '.key')
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
        let parent = node.parentElement
        return Array.prototype.indexOf.call(parent.children, node)
      }
      this.dayNumber = getElemIndex(event.target)
      console.log(getElemIndex(event.target))
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
