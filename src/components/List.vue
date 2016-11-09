<template lang="html">
  <div class="list">
    <span class="header">Available Shifts</span>
    <button @click="reverseList">Reverse</button>
    <ul>
      <coaster v-for="coaster in filteredCoasters" :coaster="coaster"></coaster>
    </ul>
  </div>

</template>

<script>
import _ from 'underscore'
import bus from '../bus'
import Coaster from './Coaster.vue'

export default {
  props: ['coasters'],
  data () {
    return {
      order: 'ASC'
    }
  },
  computed: {
    filteredCoasters () {
      if (this.order === 'ASC') {
        return _.sortBy(this.coasters, '.key').reverse()
      }
      else {
        return _.sortBy(this.coasters, '.key')
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
    Coaster
  }
}
</script>

<style lang="scss">
span.message {
  color: red;
}
</style>
