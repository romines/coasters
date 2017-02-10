<template lang="html">
  <div class="home container">
    <h1 class="title header">Available Shifts</h1>
    <div class="list">
      <div v-for="day in days">
        <!-- <ul>
          <li v-for="activity in activities">{{activity.name}}</li>
        </ul> -->
        <hr>
      </div>
      <filters ></filters>
      <ul>
        <coaster :options="{}" v-for="coaster in filteredCoasters" :coaster="coaster">

        </coaster>
      </ul>
    </div>
  </div>
</template>

<script>

let activities = [
  {
    name: 'Swimming',
    date: new Date(2017, 2, 9)
  },
  {
    name: 'Hiking',
    date: new Date(2017, 2, 9)
  },
  {
    name: 'Walking',
    date: new Date(2017, 2, 9)
  },
  {
    name: 'Coding',
    date: new Date(2017, 2, 10)
  },
  {
    name: 'Biking',
    date: new Date(2017, 2, 10)
  },
  {
    name: 'Sewing',
    date: new Date(2017, 2, 12)
  },
  {
    name: 'Hacking',
    date: new Date(2017, 2, 12)
  },
  {
    name: 'Wheezing',
    date: new Date(2017, 2, 13)
  },
  {
    name: 'Eating',
    date: new Date(2017, 2, 14)
  },
  {
    name: 'Running',
    date: new Date(2017, 2, 14)
  },
  {
    name: 'Skating',
    date: new Date(2017, 2, 14)
  },
  {
    name: 'Sleeping',
    date: new Date(2017, 2, 15)
  },
  {
    name: 'Baking',
    date: new Date(2017, 2, 16)
  },
  {
    name: 'Groaning',
    date: new Date(2017, 2, 16)
  },
];

import _ from 'lodash'
import moment from 'moment'
import Filters from './Filters.vue'
import Coaster from './Coaster/Coaster.vue'
import router from '../router'

export default {
  data () {
    return {
      activities
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
        return !coaster.history
      })
        .sortBy('time')
        .sortBy('date')
        .value()
    },
    days () {
      let obj = this.activities.reduce((days, activity) => {
        let when = moment(activity.date).format('dddd, MMM Do');
        days[when] = days[when] ? days[when] : [];
        days[when].push(activity.name);
        return days;
      }, {})

      return Object.keys(obj).reduce((arr, key) => {
        arr.push({date: key, activities: obj[key]})
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

<style lang="css">
</style>
