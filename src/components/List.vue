<template lang="html">
  <div class="list">
    <filters v-on:setDay="setDay($event)"></filters>
    <ul>
      <coaster v-for="coaster in filteredCoasters" :coaster="coaster"></coaster>
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


export default {
  data () {
    return {
      order: 'DESC',
      dayNumber: -1,
      // days: [0,1,2,3,4,5,6]
      selectedDays: []
    }
  },
  props: ['coasters'],
  mixins: [mixins],

  components: {
    Coaster,
    Filters
  },

  computed: {
    whatsFoo () {

    },
    selectedDays () {
      return this.$store.state.coasterFilters.days
    },
    selectedShiftTypes () {
      return this.$store.state.coasterFilters.shiftTypes
    },
    selectedTimes () {
      return this.$store.state.coasterFilters.times
    },
    // coasters () {
    //   return this.$store.getters.myCoasters
    // },
    filteredCoasters () {

      const withinSelectedDays = (coaster) => {
        if (this.selectedDays.length === 0) return true
        let coasterDay = moment(coaster.date).day()
        return this.selectedDays.some((day) => {
          return day === coasterDay
        })
      }

      const withinSelectedShiftTypes = (coaster) => {
        if (this.selectedShiftTypes.length === 0) return true
        return this.selectedShiftTypes.some((type) => {
          return type === coaster.shiftType
        })
      }

      const withinSelectedTimes = (coaster) => {
        if (this.selectedTimes.length === 0) return true
        return this.selectedTimes.some((time) => {
          return time === coaster.time
        })
      }

      return this.coasters
        .filter(withinSelectedDays)
        .filter(withinSelectedShiftTypes)
        .filter(withinSelectedTimes)

    },

    isHistory () {
      if (this.$store.state.route.path === '/picked-up') return true
    }
  },

  updated: function () {


  },
  methods: {}
}
</script>

<style lang="scss" rel="stylesheet/scss">
span.message {
  color: red;
}
</style>
