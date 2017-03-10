<template lang="html">
  <div class="home container">
    <h1 class="title header">Available Shifts</h1>
    <filters></filters>
    <div class="list">
      <div v-for="day in days">

        <div class="day-title title is-4">{{day.date}}</div>

        <ul>
          <coaster :options="{}" v-for="coaster in day.shifts" :coaster="coaster">

          </coaster>
        </ul>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>

import _ from 'lodash'
import moment from 'moment'
import Filters from './Filters.vue'
import Coaster from './Coaster/Coaster.vue'
import router from '../router'

export default {
  data () {
    return {
    }
  },
  components: { Filters, Coaster },
  created () {
    this.$store.dispatch('getCoasters')
  },
  computed: {
    coasters () {
      return _.chain(this.$store.state.coasters)
      .filter((coaster) => {
        return !coaster.coasterHistory
      })
        .sortBy('time')
        .sortBy('date')
        .value()
    },
    days () {
      let obj = this.filteredCoasters.reduce((days, coaster) => {
        let when = moment(coaster.date).format('dddd, MMM Do')
        days[when] = days[when] ? days[when] : []
        days[when].push(coaster)
        // days[when] = _.sortBy(days[when], 'time')
        return days
      }, {})

      return Object.keys(obj).reduce((arr, key) => {
        arr.push({date: key, shifts: obj[key]})
        return arr
      }, [])

    },

    filters () {
      return this.$store.state.coasterFilters
    },
    filteredCoasters () {

      const withinSelectedDays = (coaster) => {
        if (this.filters.days.length === 0) return true
        let coasterDay = moment(coaster.date).day()
        return this.filters.days.some((day) => {
          return day === coasterDay
        })
      }

      const withinSelectedShiftTypes = (coaster) => {
        if (this.filters.shiftTypes.length === 0) return true
        return this.filters.shiftTypes.some((type) => {
          return type === coaster.shiftType
        })
      }

      const withinSelectedTimes = (coaster) => {
        if (this.filters.times.length === 0) return true
        return this.filters.times.some((time) => {
          return time === coaster.time
        })
      }

      // _(coasters).chain()
      //   .sortBy('time')
      //   .sortBy('date')
      //   .value()

      return this.coasters
        .filter(withinSelectedDays)
        .filter(withinSelectedShiftTypes)
        .filter(withinSelectedTimes)

    },
  },
  methods: {

  },
  mounted () {},
}
</script>

<style lang="scss">
  .day-title {
    margin: .4em 0;
  }
</style>
