<template lang="html">
	<div class="date-range">
		<div class="mask" v-show="picking" @click="picking = null"></div>
		<h3 class="title is-5">Viewing</h3>
		<i class="fa fa-calendar" @click="picking = 'BEG'" v-show="picking != 'BEG'"></i>
		<span class="info">from: {{begString}} to:</span>

		<datepicker
			v-model="beginning"
			v-show="picking == 'BEG'"
			:format="'D, MMM ddsu'"
			:inline="true"
			@selected="onSelected"
			class="datepicker"></datepicker>
		<datepicker
			v-model="end"
			v-show="picking == 'END'"
			:format="'D, MMM ddsu'"></datepicker>
	</div>

</template>

<script>

import moment from 'moment'
import Datepicker from 'vuejs-datepicker'

export default {
	components: {
		Datepicker
	},
	data () {
		return {
			beginning: moment().format('YYYY-MM-DD'),
			end:       moment().add(6, 'months').format('YYYY-MM-DD'),
			picking:   null
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
