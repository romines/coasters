<template lang="html">
	<div class="date-range">
		<div class="mask" v-show="picking" @click="picking = false"></div>
		<h3 @click="picking = true" class="title is-5">
			<i class="fa fa-calendar"></i>
			Jump to date . . .</h3>
		<span class="info">from: {{begString}} to:</span>

		<datepicker
			v-model="beginning"
			v-show="picking"
			:format="'D, MMM ddsu'"
			:inline="true"
			v-on:selected="onSelected"
			class="datepicker"></datepicker>
	</div>

</template>

<script>

import moment from 'moment'
import Datepicker from 'vuejs-datepicker'
import Vue from 'vue'

export default {
	components: {
		Datepicker
	},
	data () {
		return {
			beginning: moment().format('YYYY-MM-DD'),
			// end:       moment().add(6, 'months').format('YYYY-MM-DD'),
			picking:   false
		}
	},
	computed: {
		begString () {
			return moment(this.beginning).format('MM-DD-YY')
		}
	},
	methods: {
		onSelected () {
			this.picking = null
			let vm = this
			Vue.nextTick(function () {
				console.log('selected date: ', moment(vm.beginning).format('YYYY-MM-DD'));
			  // DOM updated
				vm.$store.dispatch('getPromisedCoasters', {
					beginning: moment(vm.beginning).format('YYYY-MM-DD'),
					ending: null
				}).then(() => console.log('new coasters fetched . . .'))
			})
		}
	}
}
</script>

<style lang="scss">
.date-range {
	padding-bottom: .8em;
	div.mask {
		background-color: rgba(108, 127, 233, 0.59);
		position: fixed;
		top:0;
		left:0;
		width: 100%;
		height: 100%;
		z-index: 100;
	}
	.datepicker {
		position: absolute;
		z-index: 101;
		width: 89%;
		.calendar { width: 100%; }
	}
	.title { margin-bottom: .8em; }
	.info {
		margin-left: .3em;
	}
}

</style>
