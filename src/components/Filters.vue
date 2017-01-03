<template lang="html">
  <div class="filters">
    <!-- <button @click="reverseList">Reverse</button> -->
    <span class="days">

    <span v-for="shiftType in shiftTypes" @click="setShiftFilter(shiftType)" class="shiftType button"><img v-bind:src="loadSvg(shiftType)" alt=""></span>
    <br>
    <span v-for="day in daysOfTheWeek" @click="setDayFilter($event)" class="dayOfWeek button">{{day}}</span>
    <i @click="clearDayFilter" class="fa fa-close"></i>

    </span>
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

		setDayFilter (e) {
      let getElemIndex = (node) => {
        let parent = node.parentElement
        return Array.prototype.indexOf.call(parent.children, node)
      }
      console.log(e.target, getElemIndex(e.target));

			this.$emit('setDay', getElemIndex(e.target))

		},

    setShiftFilter (e) {
      console.log(e);
    },

    clearDayFilter () { this.$emit('setDay', -1) },
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
