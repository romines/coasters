<template lang="html">
  <div class="home">
    <h1 class="title header">Covered Shifts</h1>
    <!-- <list :coasters="pickedUp" :options="{showPickedUp: true}"></list> -->
    <div class="list">
      <ul>
        <coaster :options="{showPickedUp: true}" v-for="coaster in pickedUp" :coaster="coaster">
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

        </coaster>
      </ul>
    </div>
  </div>
</template>

<script>
// import List from './List.vue'
import mixins from '../mixins'
import moment from 'moment'

import Coaster from './Coaster/Coaster.vue'

export default {
  mixins: [mixins],
  data () {
    return {
    }
  },
  created () {
    if (this.pickedUp.length <1) this.$store.dispatch('getCoasters')
  },
  computed: {
    pickedUp () {
      return this.$store.state.coasters.filter((coaster) => {
        return coaster.coasterHistory
      })
    }
  },
  components: { Coaster },
  methods: {
    shortDate (myDate) {
      return moment(myDate).format('M/D')
    },
    shiftTypeCode (coaster) {
      
      return coaster.time
    },
    timeIcon (coaster) {
      // if (!this.coaster) return
      return (coaster.time === 'PM') ? 'fa-moon-o' : 'fa-sun-o'
    }
  }
}
</script>

<style lang="css">
</style>
