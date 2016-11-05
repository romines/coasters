<template lang="html">
  <div class="list">
    <h3>Data from the scope of the App component, passed in via prop to List component (me):
      <span class="message">{{ myMessage }}</span>
    </h3>
    <button @click="addCoaster">Add</button>
    <h3>newCoasterText: {{newCoasterText}}</h3>
    <ul>
      <coaster v-for="coaster in coasters" :coaster="coaster"></coaster>
      <!--  @remove="bubble($event)" -->
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
  created: function () {
    this.$on('remove', function () {
      console.log('an event!');
    })
  },
  props: ['myMessage', 'coasters'],

  methods: {
    addCoaster () {
      console.log('addCoaster event')
    },
    // bubble (event) {
    //   console.log("Hey! An event happened..", event);
    //   this.$emit('myEvent', event)
    //   // this.$firebaseRefs.coasters.child(key).remove()
    // }
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
