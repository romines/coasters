<template lang="html">
  <div class="home container">
    <h1 class="title header">Available Shifts</h1>

    <filters :my-filters="myFilters"
      @toggleFilter="toggleFilter" @clearFilters="clearFilters"/>

    <date-range
      :beginning="beginning"
      :last-coaster-date="lastCoasterDate"
      @selected="onDateSelected">

      <span v-if="!jumpToDateIsSet" class="range-text" slot="range-text">
        Jump to date
      </span>

      <span v-if="jumpToDateIsSet" class="range-text" slot="range-text">
        Shifts from {{ beginning.format('MM-DD-YY') }} to {{ lastCoasterDate }}
        <i class="clear fa fa-times-circle" @click.stop="resetDate"/>
      </span>

    </date-range>

    <div v-if="days.length" class="list">
      <div v-for="day in days" class="day">

        <div class="day-title title is-5">{{ day.date }}</div>

        <ul>

          <coaster
            v-for="coaster in day.shifts"
            :options="{}"
            :coaster="coaster"
            :key="coaster.key">

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

import moment from 'moment'
import Filters from './widgets/Filters.vue'
import DateRange from './widgets/DateRange.vue'
import Coaster from './Coaster/Coaster.vue'

export default {
  components: { Filters, DateRange, Coaster  },
  data () {
    return {
      beginning: moment(),
      myFilters: {
        days: [],
        times: [],
        shiftTypes: []
      }
    }
  },

  computed: {
    coasters () {
      return this.$store.state.coasters
        .filter(coaster => coaster.available)
        .filter(coaster => !coaster.inactive)
        .sort((a, b) => {
          if (a.time < b.time) {
            return -1
          }
          if (a.time > b.time) {
            return 1
          }
          return 0
        })
        .sort((a, b) => {
          if (a.date + '' < b.date + '') {
            return -1
          }
          if (a.date + '' > b.date + '') {
            return 1
          }
          return 0
        })
    },
    filteredCoasters () {

      const withinDateRange = (coaster) => {
        let coasterMoment = moment(coaster.date)
        // let beginningMoment = moment(this.beginning)
        return (coasterMoment.diff(this.beginning, 'days') >= 0)
      }

      const withinSelectedDaysOfTheWeek = (coaster) => {
        if (this.myFilters.days.length === 0) return true
        let coasterDay = moment(coaster.date).day()
        return this.myFilters.days.some((day) => {
          return day === coasterDay
        })
      }

      const withinSelectedShiftTypes = (coaster) => {
        if (this.myFilters.shiftTypes.length === 0) return true
        return this.myFilters.shiftTypes.some((type) => {
          return type === coaster.shiftType
        })
      }

      const withinSelectedTimes = (coaster) => {
        if (this.myFilters.times.length === 0) return true
        return this.myFilters.times.some((time) => {
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
        return days
      }, {})

      return Object.keys(obj).reduce((arr, key) => {
        arr.push({date: key, shifts: obj[key]})
        return arr
      }, [])

    },

    lastCoasterDate () {
      return this.filteredCoasters && moment(this.filteredCoasters[this.filteredCoasters.length -1].date).format('MM-DD-YY')
    },
    jumpToDateIsSet () {
      const today = moment()
      return !this.beginning.isSame(today, 'day')
    },
    filters () {
      return this.$store.state.coasterFilters
    },

  },
  mounted () {},
  methods: {
    toggleFilter ({ filterType, filter, index }) {
      console.log({ filterType, filter, index });
      if (index > -1) {
          this.myFilters[filterType].splice(index)
        } else {
          this.myFilters[filterType].push(filter)
      }
    },
    clearFilters () {
      this.myFilters = {
        days: [],
        times: [],
        shiftTypes: []
      }
    },
    onDateSelected (selectedMoment) {
      let selectedWasOlder = selectedMoment.isBefore(this.$store.state.coasters[0].date)
      if (selectedWasOlder) this.$store.dispatch('getPromisedCoasters', { beginning: selectedMoment.format('MM-DD-YY') })
      this.beginning = selectedMoment
    },
    resetDate () {
      this.beginning = moment()
    },
    clippedComment (comment) {
      const maxLength = 86
      if (comment.length > maxLength) {
        return comment.substr(0, maxLength) + '...'
      } else {
        return comment
      }
    }
  },
}
</script>

<style lang="scss">
.home {
  .date-range {
    padding-top: 1.1em;
  }

  .day {
    border-bottom: rgba(179, 182, 210, 0.29);
  }

  .day-title {
    margin: .4em 0 .8em 0;
    font-weight: bold;
  }
  .no-coasters { margin-top: 1em; }
}

</style>
