<template lang="html">
  <div class="home container">
    <h1 class="title header">Available Shifts</h1>
    <div class="list">
      <filters ></filters>
      <ul>
        <coaster :options="{}" v-for="coaster in filteredCoasters" :coaster="coaster">

        </coaster>
      </ul>
    </div>
  </div>
</template>

<script>
import Filters from './Filters.vue'
import Coaster from './Coaster/Coaster.vue'
import router from '../router'

export default {
  data () {
    return {}
  },
  components: { Filters, Coaster },
  created () {
    this.$store.dispatch('getCoasters')
  },
  computed: {
    coasters () {
      return this.$store.state.coasters.filter((coaster) => {
        return !coaster.history
      })
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
