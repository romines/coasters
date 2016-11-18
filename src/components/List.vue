<template lang="html">
  <div class="list">

    <span class="header" v-if="!isHistory">Available Shifts</span>
    <span class="header" v-if="isHistory">Historical Shifts</span>
    <filters v-on:setDay="setDay($event)"></filters>
    <ul>
      <coaster v-for="coaster in filteredCoasters" :coaster="coaster" as:="'LIST'"></coaster>
    </ul>
  </div>

</template>

<script>
import Coaster from './Coaster.vue'
import Filters from './Filters.vue'
import bus from '../bus'
import _ from 'underscore'
import moment from 'moment'
import mixins from '../mixins'

export default {
  props: ['coasters', 'dayIndex'],
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
    },
    isHistory () {
      if (this.$route.path === '/history') return true
    }
  },
  updated: function () {


  },
  methods: {
    reverseList () {
      console.log(this.coasters);
      this.order = (this.order === 'ASC') ? 'DESC' : 'ASC'
    },
    setDay (day) {
      this.dayNumber = day
    }

  },
  components: {
    Coaster,
    Filters
  }
}
</script>

<style lang="scss">
span.message {
  color: red;
}
</style>
