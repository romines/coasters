<template lang="html">

  <div class="filters">
    <div class="shift-types">
      <span
        v-for="shiftType in shiftTypes"
        class="shiftType button"
        :class="{ 'is-active': isActiveFilter('shiftTypes', shiftType) }"
        @click="toggleFilter('shiftTypes', shiftType)">
        <img :src="loadSvg(shiftType)">
      </span>&nbsp;
      <span
        v-for="time in times"
        class="time button"
        :class="{ 'is-active': isActiveFilter('times', time) }"
        @click="toggleFilter('times', time)">
        {{ time }}
      </span>
    </div>

    <div class="days-of-the-week">
      <span v-for="(day, index) in daysOfTheWeek"
        class="dayOfWeek button"
        :class="{ 'is-active': isActiveFilter('days', index) }"
        @click="toggleFilter('days', index)">
        {{ day }}
      </span>

    </div>

    <div v-if="hasFilters" class="filters-applied">

      <div class="header is-4">Showing only:</div>

      <div class="tags-and-clear">
        <div class="filter-tags">

          <span v-for="shiftType in myFilters.shiftTypes" class="tag is-info is-small">
            {{ shiftType }}
            <button class="delete is-small" @click="toggleFilter('shiftTypes', shiftType)" />
          </span>

          <span v-for="time in myFilters.times" class="tag is-info is-small">
            {{ time }}
            <button class="delete is-small" @click="toggleFilter('times', time)" />
          </span>

          <span v-for="day in myFilters.days" class="tag is-info is-small">
            {{ getDayString(day) }}
            <button class="delete is-small" @click="toggleFilter('days', day)" />
          </span>

        </div>
        <span class="clear button is-small" @click="clearFilters">Clear All</span>

      </div>

    </div>


  </div>

</template>

<script>
import mixins from '../mixins'
import { mapState } from 'vuex'

export default {
  mixins: [mixins],
  props: {
    myFilters: {
      type: Object
    }
  },
  data () {
    return {}
  },
  computed: {
    hasFilters () {
      return !!this.myFilters.shiftTypes.length || !!this.myFilters.times.length || !!this.myFilters.days.length
    },
    ...mapState([
      'daysOfTheWeek',
      'shiftTypes',
      'times',
      'coasterFilters'
    ])
  },
	created () {
	},
	methods: {
    isActiveFilter (type, value) {
      return this.myFilters[type].indexOf(value) > -1
    },

		toggleFilter (type, value) {

      const index = this.myFilters[type].indexOf(value)

      const payload = {
        filterType: type,
        filter: value,
        index,
      }

      this.$emit('toggleFilter', payload)

		},

    clearFilters () {
      this.$emit('clearFilters')
    },

    getDayString (day) {
      const dayStrings = ['Sun','Mon','Tue','Wed','Thr','Fri','Sat']
      return dayStrings[day]
    }

	},
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
