<template lang="html">
  <div class="list">
    <span class="header">Available Shifts</span>
    <filters></filters>
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

export default {
  props: ['coasters', 'dayIndex'],
  data () {
    return {
      order: 'ASC',
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
        return _.sortBy(filteredByDay, '.key').reverse()
      }
      else {
        return _.sortBy(filteredByDay, '.key')
      }
    }
  },
  created: function () {
    this.$on('remove', function () {
      console.log('an event!');
    })
  },
  methods: {
    reverseList () {
      console.log(this.coasters);
      this.order = (this.order === 'ASC') ? 'DESC' : 'ASC'
    }

  },
  components: {
    Coaster,
    Filters
  }
}
</script>

<style lang="scss">
span.message {
  color: red;
}
</style>
