<template lang="html">
	<div class="date-range">
		<div v-show="picking" class="mask" @click.capture="picking = false"/>

    <span class="icon-and-text" @click.stop="picking = true">
      <i class="fa fa-calendar" />
      <slot name="range-text">
        <span v-if="!jumpToDateIsSet" class="range-text">
          Jump to date
        </span>

        <span v-if="jumpToDateIsSet" class="range-text">
          Shifts from {{ beginning.format('MM-DD-YY') }} to {{ lastCoasterDateString }}
          <i class="clear fa fa-times-circle" @click.stop="$emit('resetDate')"/>
        </span>
      </slot>
    </span>

		<datepicker
			v-show="picking"
			class="datepicker"
			v-model="localState.beginningDate"
			:format="'D, MMM ddsu'"
			:inline="true"
			@selected="onSelected"/>

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
  props: {
    beginning: {
      type: Object,
      validator (val) {
        return moment.isMoment(val)
      }
    },
    lastCoasterMoment: {
      type: Object,
      validator (val) {
        return moment.isMoment(val)
      }
    }
  },
	data () {
    return {
      localState: {
        beginningDate: new Date()
      },
			picking:   false
		}
	},
  computed: {
    jumpToDateIsSet () {
      const today = moment()
      return !this.beginning.isSame(today, 'day')
    },
    begString () {
      return this.beginning.format('MM-DD-YY')
    },
    lastCoasterDateString () {
      if (!this.lastCoasterMoment) return '...'
      return this.lastCoasterMoment.format('MM-DD-YY')
    }
  },
  watch: {
    beginning (val) {
      this.localState.beginningDate = val.toDate()
    }
  },
	methods: {
		onSelected () {
			this.picking = null
			Vue.nextTick(() => {
				this.$emit('selected', moment(this.localState.beginningDate))
			})
		}
	}
}
</script>

<style lang="scss">
.date-range {
	padding-bottom: .8em;
  .icon-and-text {
    display: inline-flex;
    align-items: center;
    .fa-calendar { transform: translateY(-.1em); }
    .range-text {
      user-select: none;
      display: inline-flex;
      position: relative;
      align-items: center;
      padding: .3em .6em;
      border: 1px solid #dbdbdb;
      border-radius: 3px;
      display: inline-block;
      margin-left: 1em;
      i.clear {
        opacity: .9;
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(60%, -50%)
      }
    }
  }
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
		position: fixed;
		left: 2%;
    top: 62px;
    // width: 90%;
		z-index: 101;
    .vdp-datepicker__calendar {
      width: 96vw;
    }
		.calendar { width: 100%; }
	}
	.title { margin-bottom: .8em; }
	.info {
		margin-left: .3em;
	}
}

</style>
