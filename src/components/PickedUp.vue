<template lang="html">
  <div class="covered">
    <h1 class="title header">Covered Shifts</h1>
    <div class="list">
      <ul>
        <coaster :options="{}" v-for="coaster in pickedUp" :coaster="coaster" :key="coaster.key">

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

          </div>

          <div slot="main">

            <div class="posted-by media">
              <div class="media-left">
                <figure class="user">
                  <img v-if="coaster.postedBy.photoURL" :src="coaster.postedBy.photoURL" alt="">
                  <span v-if="!coaster.postedBy.photoURL" class="icon is-large">
                    <i class="fa fa-user"></i>
                  </span>
                </figure>
              </div>

              <div class="media-content">
                <p>scheduled:</p>
                <h3 class="title">{{coaster.postedBy.displayName}}</h3>
              </div>
            </div>

            <div class="picked-up-by">
              <div class="posted-by media">
                <div class="media-left">
                  <figure class="user">
                    <img v-if="coaster.heldBy.photoURL" :src="coaster.heldBy.photoURL" alt="">
                    <span v-if="!coaster.heldBy.photoURL" class="icon is-large">
                      <i class="fa fa-user"></i>
                    </span>
                  </figure>
                </div>

                <div class="media-content">
                  <p>covering:</p>
                  <h3 class="title">{{coaster.heldBy.name}}</h3>
                </div>
              </div>
            </div>

            <div class="desktop-comments">{{ coaster.comment }}</div>

          </div>



        </coaster>
      </ul>
    </div>
  </div>
</template>

<script>
import store from '../store'
import { firebase } from '../libs'
import moment from 'moment'
import _ from 'lodash'
import mixins from '../mixins'
const db = firebase.database()
const coastersRef = db.ref('data/coasters')

import Coaster from './Coaster/Coaster.vue'

export default {
  mixins: [mixins],
  // beforeRouteEnter (to, from, next) {
  //
  //
  //   // let today = moment().format('YYYY-MM-DD')
  //   // let listRef = coastersRef.orderByChild('date').startAt(today)
  //   //
  //   // listRef.once('value', (snap) => {
  //   //   let coasters = []
  //   //   snap.forEach((childSnap) => {
  //   //     let coaster = childSnap.val()
  //   //     if (!coaster.key) coaster.key = childSnap.key
  //   //     coasters.push(coaster)
  //   //   })
  //   //   store.commit('GET_COASTERS', coasters)
  //   //   next()
  //   // })
  // },
  data () {
    return {
    }
  },

  computed: {
    pickedUp () {
      return _.chain(this.$store.state.coasters).filter((coaster) => {
        return !coaster.available
      })
      .sortBy('time')
      .sortBy('date')
      .value()
    }
    // pickingUpUser (coaster) {
    //   // if (!coaster.history) return
    //   // let history = coaster.history
    //   // let trades = [];
    //   // for(var item in history) {
    //   //     trades.push(history[item])
    //   // }
    //   // return trades[trades.length -1].pickedUpBy
    //   return coaster.heldBy
    // },
  },
  components: { Coaster },
  methods: {
    // pickingUpUser (coaster) {
    //   // if (!coaster.history) return
    //   // let history = coaster.history
    //   // let trades = [];
    //   // for(var item in history) {
    //   //     trades.push(history[item])
    //   // }
    //   // return trades[trades.length -1].pickedUpBy
    //   return coaster.heldBy
    // },
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
  .card-header-title {
    font-size: 1.45em;
    .fa {vertical-align: super;}
  }
}
</style>
