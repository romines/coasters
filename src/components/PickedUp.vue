<template lang="html">
  <div class="covered container">
    <h1 class="title header">Covered Shifts</h1>

    <date-range v-on:selected="onDateSelected"/>

    <div class="list">
      <div v-for="day in days">

        <div class="day-title title is-5">{{day.date}}</div>

        <ul>
          <!--
            **
             * Coaster
             *
              -->
          <coaster :options="{}" v-for="coaster in day.shifts" :coaster="coaster" :key="coaster.key">

            <div slot="cardHeader">

              <header class="card-header">
                <p class="card-header-title">
                  <span class="icons">
                    <span class="time"><i class="fa" :class="timeIcon(coaster)"></i></span>
                    <img class="shift-icon" v-bind:src="loadSvg(coaster.shiftType)" alt="">
                  </span>
                  <span class="shift-type-code">{{shiftTypeCode(coaster)}}</span>
                  <span class="date">{{shortDate(coaster.date)}}</span>
                </p>
              </header>

            </div>  <!--  End 'cardHeader' slot -->


            <trade-detail slot="main" :coaster='coaster'></trade-detail>
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
import store from '../store'
import { firebase } from '../libs'
import moment from 'moment'
import _ from 'lodash'
import mixins from '../mixins'
import Coaster from './Coaster/Coaster.vue'
import DateRange from './widgets/DateRange.vue'
import TradeDetail from './Coaster/TradeDetail.vue'

const db = firebase.database()
const coastersRef = db.ref('data/coasters')


export default {
  mixins: [mixins],
  components: { Coaster, DateRange, TradeDetail },

  data () {
    return {
      beginning: moment()
    }
  },

  computed: {
    pickedUp () {
      return _.chain(this.$store.state.coasters).filter((coaster) => {
        return coaster.history
      }).filter((coaster) => {
        let coasterMoment = moment(coaster.date)
        let beginningMoment = moment(this.beginning)
        return (coasterMoment.diff(beginningMoment, 'days') >= 0)
      })
      .sortBy('time')
      .sortBy('date')
      .value()
    },
    days () {
      let obj = this.pickedUp.reduce((days, coaster) => {
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

  },

  methods: {
    onDateSelected (date) {
      let selectedWasOlder = moment(date).isBefore(this.$store.state.coasters[0].date)
      if (selectedWasOlder) this.$store.dispatch('getPromisedCoasters', {beginning: date})

      this.beginning = moment(date)
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
