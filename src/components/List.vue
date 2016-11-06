<template lang="html">
  <div class="list">
    <span class="header">Available Shifts</span>
    <button @click="reverseList">Reverse</button>
    <ul>
      <coaster v-for="coaster in coasters" :coaster="coaster"></coaster>
    </ul>
  </div>

</template>

<script>
import Coaster from './Coaster.vue'
import bus from '../bus'

export default {
  data () {
    return {
    }
  },
  created: function () {
    this.$on('remove', function () {
      console.log('an event!');
    })
  },
  props: ['myMessage', 'coasters'],

  methods: {
    reverseList () {
      bus.$emit('msg', {
        type: bus.REVERSE_LIST,
        payload: {
          foo: 'foo',
          bar: 'bar'
        }
      })
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
