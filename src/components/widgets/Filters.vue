<template lang="html">

  <div class="filters">

    <div class="filter-button-row">

      <span class="filter-group shift-types">
        <span
          v-for="shiftType in shiftTypes"
          class="shift-type button"
          :class="{ 'is-active': isActiveFilter('shiftTypes', shiftType) }"
          @click="toggleFilter('shiftTypes', shiftType)">
          <img :src="loadSvg(shiftType)">
        </span>
      </span>

      <span class="filter-group">
        <span
          v-for="time in times"
          class="time button"
          :class="{ 'is-active': isActiveFilter('times', time) }"
          @click="toggleFilter('times', time)">
          {{ time }}
        </span>
      </span>

    </div>

    <div class="filter-button-row">

      <span class="filter-group days-of-the-week">
        <span v-for="(day, index) in daysOfTheWeek"
          class="dayOfWeek button"
          :class="{ 'is-active': isActiveFilter('days', index) }"
          @click="toggleFilter('days', index)">
          {{ day }}
        </span>
      </span>

    </div>

    <div v-if="hasFilters" class="filters-applied">

      <div class="header is-4">Showing only:</div>

      <div class="tags-and-clear">
        <div class="filter-tags">

          <span v-for="shiftType in myFilters.shiftTypes" class="tag is-info">
            {{ shiftType }}
            <button class="delete" @click="toggleFilter('shiftTypes', shiftType)" />
          </span>

          <span v-for="time in myFilters.times" class="tag is-info">
            {{ time }}
            <button class="delete" @click="toggleFilter('times', time)" />
          </span>

          <span v-for="day in myFilters.days" class="tag is-info">
            {{ getDayString(day) }}
            <button class="delete" @click="toggleFilter('days', day)" />
          </span>

        </div>
        <span class="clear button" @click="clearFilters">Clear All</span>

      </div>

    </div>


  </div>

</template>

<script>
import mixins from '../../mixins'
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
  @import '~bulma/sass/utilities/variables.sass';
  .filter-button-row {
    display: flex;
    margin-bottom: .6em;
  }
  .filter-group {
    display: inline-flex;
    margin-right: 1.6em;

    .button {
      width: 11vw;
      height: 10vw;
      margin-right: .12em;
      border-width: 2px;
      &:hover:not(.is-active) { border-color: #dbdbdb}
    }

  }
  .shift-type {
    // padding-right: .3em;

    img {
      width: 4.8vw;
      max-width: 30px;
    }
  }
  .dayOfWeek {
    font-family: $family-monospace;
    font-size: 1.3em;
  }
  .filters-applied { margin-top: .5em; }
  .tags-and-clear {
    display: flex;
    justify-content: space-between;
    .tag {
      margin: .2em .1em;
    }

  }

</style>
