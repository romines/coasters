<template lang="html">
  <div class="filters">
	  <button @click="reverseList">Reverse</button>
	  <span class="days">

		<button @click="setDayFilter($event)" class="dayOfWeek">S</button>
		<button @click="setDayFilter($event)" class="dayOfWeek">M</button>
		<button @click="setDayFilter($event)" class="dayOfWeek">T</button>
		<button @click="setDayFilter($event)" class="dayOfWeek">W</button>
		<button @click="setDayFilter($event)" class="dayOfWeek">R</button>
		<button @click="setDayFilter($event)" class="dayOfWeek">F</button>
		<button @click="setDayFilter($event)" class="dayOfWeek">S</button>
		<img @click="clearDayFilter" class="close" :src="loadSvg('close')" />
	  </span>
  </div>
</template>

<script>
import mixins from '../mixins'
import bus from '../bus'
import moment from 'moment'
export default {
	methods: {

		setDayFilter (e) {
      let getElemIndex = (node) => {
        let parent = node.parentElement
        return Array.prototype.indexOf.call(parent.children, node)
      }
      console.log(e.target, getElemIndex(e.target));

			this.$emit('setDay', getElemIndex(e.target))

		},

    clearDayFilter () { this.$emit('setDay', -1) }

	},
	mixins: [mixins],
	created () {
		console.log(bus.MAKE_DETAIL);
	}
}
</script>

<style lang="scss">
</style>
