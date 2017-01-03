<template lang="html">
  <div class="filters">
    <!-- <button @click="reverseList">Reverse</button> -->

    <span v-for="shiftType in shiftTypes" @click="setShiftFilter(shiftType)" class="shiftType button"><img v-bind:src="loadSvg(shiftType)" alt=""></span>
    <br>
    <div class="days">
      <span v-for="(day, index) in daysOfTheWeek"
        @click="setDayFilter($event)"
        v-bind:class="{'is-active':isActiveDay(index)}"
        class="dayOfWeek button">{{day}}
      </span>
      <span @click="clearDayFilter" class="button">Clear All</span>
    </div>
  </div>
</template>

<script>
import mixins from '../mixins'
import bus from '../bus'
import moment from 'moment'
export default {
  data () {
    return {
      daysOfTheWeek: ['S','M','T','W','R','F','S'],
      shiftTypes: ['Host', 'Bus', 'Barback', 'Serve', 'Bartend']
    }
  },
	methods: {
    isActiveDay (day) {

      if (this.$store.state.coasterFilters.days.indexOf(day) !== -1) {
        return true
      }
    },

		setDayFilter (e) {
      let parent = e.target.parentElement
      let day = Array.prototype.indexOf.call(parent.children, e.target)

      let dayIndexInFilters = this.$store.state.coasterFilters.days.indexOf(day)

      if (dayIndexInFilters !== -1) {
        this.$store.commit('REMOVE_FILTER', dayIndexInFilters)
      } else {
        this.$store.commit('ADD_FILTER', day)
      }

		},

    setShiftFilter (e) {
      console.log(e);
    },

    clearDayFilter () { this.$store.commit('CLEAR_FILTERS') },
    reverseList () {console.log('list reversal requested');}

	},
	mixins: [mixins],
	created () {
	}
}
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '../../node_modules/bulma/sass/utilities/variables.sass';
  .dayOfWeek {
    font-family: $family-monospace
  }
  .shiftType {
    img {
      width: 1em;
    }
  }

</style>
