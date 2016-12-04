<template lang="html">
  <div class="list">
    <div class="test">Baz: {{baz}}</div>
    <span class="header" v-if="!isHistory">Available Shifts</span>
    <span class="header" v-if="isHistory">Historical Shifts</span>
    <filters v-on:setDay="setDay($event)"></filters>
    <ul>
      <coaster v-for="coaster in filteredCoasters" :coaster="coaster" as:="'LIST'"></coaster>
    </ul>
  </div>

</template>

<script>
import Coaster from './Coaster.vue'
import Filters from './Filters.vue'
import bus from '../bus'
import _ from 'underscore'
import moment from 'moment'
import mixins from '../mixins'

// list has local state which is basically filters / querires
// TODO

export default {
  props: ['coasters', 'dayIndex', 'myProps'],
  data () {
    return {
      order: 'DESC',
      prop: 'date',//'.key',
      dayNumber: -1
    }
  },
  mixins: [mixins],
  computed: {
    filteredCoasters () {
      let filteredByDay = this.coasters.filter((coaster) => {
        if (this.dayNumber < 0) return true
        return moment(coaster.date).day() === this.dayNumber
      })

      if (this.order === 'ASC') {
        return _.sortBy(filteredByDay, this.prop).reverse()
      }
      else {
        return _.sortBy(filteredByDay, this.prop)
      }
    },
    isHistory () {
      if (this.$route.path === '/history') return true
    }
  },
  created () {
    console.log(this.myProps.authState.status);
  },
  updated: function () {


  },
  methods: {
    reverseList () {
      console.log(this.coasters);
      this.order = (this.order === 'ASC') ? 'DESC' : 'ASC'
    },
    setDay (day) {
      this.dayNumber = day
    }

  },
  // shifts and changes are primary data Object
  // presented in various list like views
  //
  // views have a list of actions they can call for
  // ...via emitting messages
  //
  components: {
    Coaster,
    Filters
  }
}
</script>

<style lang="sass">
span.message {
  color: red;
}
</style>
