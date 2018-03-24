<template lang="html">
  <div class="covered container">
    <h1 class="title header">Covered Shifts</h1>

    <date-range
      :beginning="beginning"
      :last-coaster-moment="lastCoasterMoment"
      @selected="onDateSelected"
      @resetDate="resetDate" />

    <div class="list">
      <div v-for="day in days">

        <div class="day-title title is-5">{{ day.date }}</div>

        <ul>
          <!--
            **
             * Coaster
             *
              -->
          <coaster
            v-for="coaster in day.shifts"
            :options="{}"
            :coaster="coaster"
            :key="coaster.key">

            <div slot="cardHeader">

              <header class="card-header">
                <p class="card-header-title">
                  <span class="icons">
                    <span class="time"><i class="fa" :class="timeIcon(coaster)" /></span>
                    <img class="shift-icon" :src="loadSvg(coaster.shiftType)" >
                  </span>
                  <span class="shift-type-code">{{ shiftTypeCode(coaster) }}</span>
                  <span class="date">{{ shortDate(coaster.date) }}</span>
                </p>
              </header>

            </div>  <!--  End 'cardHeader' slot -->


            <trade-detail slot="main" :coaster="coaster"/>
            <!--  End 'main' slot -->


          </coaster>
          <!--
            **
            * End Coaster
            *
          -->
        </ul>
        <hr>
      </div>

    </div>
  </div>
</template>

<script>
// import store from '../store'
// import { firebase } from '../libs'
import moment from 'moment'
import mixins from '../mixins'
import Coaster from './Coaster/Coaster.vue'
import DateRange from './widgets/DateRange.vue'
import TradeDetail from './Coaster/TradeDetail.vue'

// const db = firebase.database()
// const coastersRef = db.ref('data/coasters')


export default {
  components: { Coaster, DateRange, TradeDetail },
  mixins: [mixins],

  data () {
    return {
      beginning: moment()
    }
  },

  computed: {
    filteredCoasters () {

      const withinDateRange = (coaster) => {
        let coasterMoment = moment(coaster.date)
        return (coasterMoment.diff(this.beginning, 'days') >= 0)
      }

      return this.$store.state.coasters.filter(coaster => coaster.history)
      .filter(withinDateRange)
      .filter(coaster => !coaster.inactive)
      .sort((a, b) => {
        if (a.time < b.time) {
          return -1
        }
        if (a.time > b.time) {
          return 1
        }
        return 0
      })
      .sort((a, b) => {
        if (a.date + '' < b.date + '') {
          return -1
        }
        if (a.date + '' > b.date + '') {
          return 1
        }
        return 0
      })
    },

    days () {
      // coasters grouped by date of shift
      //
      let obj = this.filteredCoasters.reduce((days, coaster) => {
        let when = moment(coaster.date).format('dddd, MMM Do')
        days[when] = days[when] ? days[when] : []
        days[when].push(coaster)
        return days
      }, {})

      return Object.keys(obj).reduce((arr, key) => {
        arr.push({date: key, shifts: obj[key]})
        return arr
      }, [])

    },
    lastCoasterMoment () {
      if (!this.filteredCoasters.length) return
      return moment(this.filteredCoasters[this.filteredCoasters.length -1].date)
    },

  },

  methods: {
    onDateSelected (selectedMoment) {
      let selectedWasOlder = selectedMoment.isBefore(this.$store.state.coasters[0].date)
      if (selectedWasOlder) this.$store.dispatch('getPromisedCoasters', { beginning: selectedMoment.format('MM-DD-YY') })

      this.beginning = selectedMoment
    },
    resetDate () {
      this.beginning = moment()
    },
    shortDate (myDate) {
      return moment(myDate).format('ddd M/D')
    },
    shiftTypeCode (coaster) {

      const shiftAbrvs = {
        Serve: 'Srv',
        Bus: 'Bus',
        Barback: 'BB',
        Host: 'Host',
        Bartend: 'Bar'
      }

      return coaster.time + shiftAbrvs[coaster.shiftType]

    },

    timeIcon (coaster) {
      // if (!coaster) return
      return (coaster.time === 'PM') ? 'fa-moon-o' : 'fa-sun-o'
    }
  }
}
</script>

<style lang="scss">
.covered {

  .card-header {
    .card-header-title {
      font-size: 1.45em;
      .fa {vertical-align: super;}
    }
    .time i.fa { font-size: 1.5em; }
    img.shift-icon {
      width: 10vw;
    }
  }

}
</style>
