<template lang="html">
  <div class="list">
    <span class="header" v-if="!isHistory">Available Shifts</span>
    <span class="header" v-if="isHistory">Historical Shifts</span>
    <filters v-on:setDay="setDay($event)"></filters>
    <ul>
      <coaster v-for="coaster in filteredCoasters" :coasterAsProp="coaster" as:="'LIST'"></coaster>
    </ul>
  </div>

</template>

<script>
import Coaster from './Coaster/Coaster.vue'
import Filters from './Filters.vue'
import bus from '../bus'
import _ from 'underscore'
import moment from 'moment'
import mixins from '../mixins'
import { mapGetters } from 'vuex'

// list has local state which is basically filters / querires
// TODO

export default {
  props: ['dayIndex'],
  data () {
    return {
      order: 'DESC',
      prop: 'date',//'.key',
      dayNumber: -1,
      // days: [0,1,2,3,4,5,6]
      selectedDays: []
    }
  },
  mixins: [mixins],
  computed: {
    selectedDays () {
      return this.$store.state.coasterFilters.days
    },
    coasters () {
      return this.$store.getters.myCoasters
    },
    filteredCoasters () {

      const withinSelectedDays = (coaster) => {
        if (this.selectedDays.length === 0) return true
        let coasterDay = moment(coaster.date).day()
        return this.selectedDays.some((day) => {
          return day === coasterDay
        })
      }

      return this.coasters.filter(withinSelectedDays)

    },
    isHistory () {
      if (this.$route.path === '/history') return true
    }
  },
  created () {
    this.$store.dispatch('getCoasters')
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
  // shifts and changes are primary data Object
  // presented in various list like views
  //
  // views have a list of actions they can call for
  // ...via emitting messages
  //
  components: {
    Coaster,
    Filters
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
span.message {
  color: red;
}
</style>
