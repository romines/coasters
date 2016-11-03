<template lang="html">
  <div class="list">
    <button @click="addCoaster">Add</button>
    <h3>newCoasterText: {{newCoasterText}}</h3>
    <ul>
      <coaster @action="bubble($event)" v-for="coaster in coasters" :coaster="coaster"></coaster>
    </ul>
  </div>

</template>

<script>
import Coaster from './Coaster.vue'
export default {
  data () {
    return {
      newCoasterText: ''
    }
  },
  props: ['coasters'],

  methods: {
    addCoaster () {
      console.log('addCoaster event')
    },
    bubble (event) {
      this.$emit('interEvent', event)
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
