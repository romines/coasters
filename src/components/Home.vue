<template lang="html">
  <div class="home container">
    <h1 class="title header">Available Shifts</h1>
    <filters/>
    <div v-if="days.length" class="list">
      <div v-for="(day, index) in days" class="day" :class="{'darker':  index%2==0}">

        <div class="day-title title is-5">{{day.date}}</div>

        <ul>

          <coaster :options="{}" v-for="coaster in day.shifts" :coaster="coaster" :key="coaster.key">

            <div slot="comments">
              <div class="top-level-comment">{{ clippedComment(coaster.comment) }}</div>
            </div>

          </coaster>

        </ul>
        <hr>
      </div>
    </div>
    <div v-if="!days.length" class="no-coasters">
      <div class="title is-4">Looks like no coasters match this date range/filter combination</div>
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
      beginning: moment()
    }
  },
  components: { Filters, Coaster },

  computed: {
    coasters () {
      return _.chain(this.$store.state.coasters)
      .filter(coaster => coaster.available)
      .filter(coaster => !coaster.inactive)
        .sortBy('time')
        .sortBy('date')
        .value()
    },
    filteredCoasters () {

      const withinDateRange = (coaster) => {
        let coasterMoment = moment(coaster.date)
        let beginningMoment = moment(this.beginning)
        return (coasterMoment.diff(beginningMoment, 'days') >= 0)
      }

      const withinSelectedDaysOfTheWeek = (coaster) => {
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

      return this.coasters
        .filter(withinDateRange)
        .filter(withinSelectedDaysOfTheWeek)
        .filter(withinSelectedShiftTypes)
        .filter(withinSelectedTimes)

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

  },
  methods: {
    clippedComment (comment) {
      const maxLength = 86
      if (comment.length > maxLength) {
        return comment.substr(0, maxLength) + '...'
      } else {
        return comment
      }
    }
  },
  mounted () {},
}
</script>

<style lang="scss">
.home {
  .day {
    padding-top: .6em;
    &.darker { background-color: rgba(179, 182, 210, 0.29); }
  }

  .day-title {
    margin: .4em 0;
  }
  .no-coasters { margin-top: 1em; }
}

</style>
