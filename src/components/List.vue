<template lang="html">
  <div class="list">
    <h3>Data from the scope of the App component, passed in via prop to List component (me):
      <span class="message">{{ myMessage }}</span>
    </h3>
    <button @click="addCoaster">Add</button>
    <h3>newCoasterText: {{newCoasterText}}</h3>
    <ul>
      <coaster @action="handleChildEvent($event)" v-for="coaster in coasters" :coaster="coaster"></coaster>
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
  props: ['myMessage', 'coasters'],

  methods: {
    addCoaster () {
      console.log('addCoaster event')
    },
    handleChildEvent (event) {
      // console.log("Hey! A 'remove' event happened..", event);
      this.$emit('interEvent', event)
      // this.$firebaseRefs.coasters.child(key).remove()
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
