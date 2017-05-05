<template lang="html">

  <div class="filters">
    <div class="shift-types">
      <span
        v-for="shiftType in shiftTypes"
        @click="toggleFilter('shiftTypes', shiftType)"
        v-bind:class="{ 'is-active': isActiveFilter('shiftTypes', shiftType) }"
        class="shiftType button">
        <img v-bind:src="loadSvg(shiftType)" alt="">
      </span>&nbsp;
      <span
        v-for="time in times"
        @click="toggleFilter('times', time)"
        v-bind:class="{ 'is-active': isActiveFilter('times', time) }"
        class="time button">
        {{time}}
      </span>
    </div>

    <div class="days-of-the-week">
      <span v-for="(day, index) in daysOfTheWeek"
        @click="toggleFilter('days', index)"
        v-bind:class="{ 'is-active': isActiveFilter('days', index) }"
        class="dayOfWeek button">{{day}}
      </span>

    </div>

    <div v-if="hasFilters" class="filters-applied">

      <div class="header is-4">Showing only:</div>

      <div class="tags-and-clear">
        <div class="filter-tags">
          <span v-for="shiftType in coasterFilters.shiftTypes" class="tag is-info is-small">
            {{shiftType}}
            <button @click="toggleFilter('shiftTypes', shiftType)"class="delete is-small"></button>
          </span>
          <span v-for="time in coasterFilters.times" class="tag is-info is-small">
            {{time}}
            <button @click="toggleFilter('times', time)"class="delete is-small"></button>
          </span>
          <span v-for="day in coasterFilters.days" class="tag is-info is-small">
            {{getDayString(day)}}
            <button @click="toggleFilter('times', time)"class="delete is-small"></button>
          </span>
        </div>
        <span @click="clearFilters" class="button clear is-small">Clear All</i></span>

      </div>

    </div>


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
  computed: {
    hasFilters () {
      return !!this.$store.state.coasterFilters.shiftTypes.length || !!this.$store.state.coasterFilters.times.length || !!this.$store.state.coasterFilters.days.length
    },
    ...mapState([
      'daysOfTheWeek',
      'shiftTypes',
      'times',
      'coasterFilters'
    ])
  },
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

    clearFilters () { this.$store.commit('CLEAR_FILTERS') },

    getDayString (day) {
      const dayStrings = ['Sun','Mon','Tue','Wed','Thr','Fri','Sat']
      return dayStrings[day]
    }

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
  .filters-applied { margin-top: .5em; }
  .tags-and-clear {
    margin-top: .5em;
    display: flex;
    justify-content: space-between;
    .tag {
      margin-right: .2em;

    }

  }

</style>
