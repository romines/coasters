<template lang="html">
  <div class="filters">
	  <button @click="reverseList">Reverse</button>
	  <span class="days">

		<button @click="setDayFilter" class="dayOfWeek">S</button>
		<button @click="setDayFilter" class="dayOfWeek">M</button>
		<button @click="setDayFilter" class="dayOfWeek">T</button>
		<button @click="setDayFilter" class="dayOfWeek">W</button>
		<button @click="setDayFilter" class="dayOfWeek">R</button>
		<button @click="setDayFilter" class="dayOfWeek">F</button>
		<button @click="setDayFilter" class="dayOfWeek">S</button>
		<img @click="dayNumber = -1" class="close" :src="loadSvg('close')" />
	  </span>
  </div>
</template>

<script>
import mixins from '../mixins'
import bus from '../bus'
export default {
	methods: {
		setDayFilter () {
			console.log('sDF')
			this.$emit()
		}
	},
	mixins: [mixins],
	created () {
		console.log(bus.MAKE_DETAIL);
	}
}
</script>

<style lang="scss">
</style>
