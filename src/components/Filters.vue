<template lang="html">

  <div class="filters">
    <div class="header title is-5">Show only</div>
    <div class="shift-types">
      <span
        v-for="shiftType in shiftTypes"
        @click="toggleFilter('shiftTypes', shiftType)"
        v-bind:class="{ 'is-active': isActiveFilter('shiftTypes', shiftType) }"
        class="shiftType button">
        <img v-bind:src="loadSvg(shiftType)" alt="">
      </span>
    </div>
    <div class="days-of-the-week">
      <span v-for="(day, index) in daysOfTheWeek"
      @click="toggleFilter('days', index)"
      v-bind:class="{ 'is-active': isActiveFilter('days', index) }"
      class="dayOfWeek button">{{day}}
    </span>

    </div>


    &nbsp;
    <div class="times">
      <span
      v-for="time in times"
      @click="toggleFilter('times', time)"
      v-bind:class="{ 'is-active': isActiveFilter('times', time) }"
      class="time button">
      {{time}}
    </span>
  </div>
  <span @click="clearDayFilter" class="button">Clear Filters</i></span>

  </div>

</template>

<script>
import mixins from '../mixins'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
  data () {
    return {}
  },
  computed: mapState([
    'daysOfTheWeek',
    'shiftTypes',
    'times'
  ]),
	methods: {
    isActiveFilter (type, value) {
      if (this.$store.state.coasterFilters[type].indexOf(value) !== -1) {
        return true
      }
    },

		toggleFilter (type, value) {

      let indexInFilters = this.$store.state.coasterFilters[type].indexOf(value)

      let payload = {
        filterType: type,
        filter: value
      }

      if (indexInFilters !== -1) {  // if already applied, remove
        payload.index = indexInFilters;
        this.$store.commit('REMOVE_FILTER', payload)

      } else {
        this.$store.commit('ADD_FILTER', payload)
      }

		},

    setShiftFilter (e) {
      console.log(e);
    },

    clearDayFilter () { this.$store.commit('CLEAR_FILTERS') },

	},
	mixins: [mixins],
	created () {
	}
}
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '../../node_modules/bulma/sass/utilities/variables.sass';
  .shiftType {
    img {
      width: 3.8vw;
      max-width: 20px;
    }
  }
  .dayOfWeek {
    font-family: $family-monospace;
    font-size: 1.2em;
  }

</style>
