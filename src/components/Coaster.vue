<template lang="html">
  <li>
    <ul>
      <li>{{ coaster.date }}</li>
      <li>{{ coaster.time }}</li>
      <li>{{ coaster.shiftType }}</li>
      <li>{{ coaster.comment }}</li>
    </ul>
    <button @click="removeCoaster(coaster['.key'])">X</button>
  </li>
</template>

<script>
export default {
  props: ['coaster'],
  data () {
    return {}
  },
  computed: {},
  ready () {
    console.log('coaster', this.coaster);
  },
  attached () {},
  methods: {
    removeCoaster (key) {
      this.$emit('remove', [event.target, key, 'foo', {bar: 'baz'}])
      // this.$firebaseRefs.coasters.child(key).remove()
    },
  },
  components: {}
}
</script>

<style lang="scss">
  ul {
    list-style-type: none;
    li {
      background-color: rgb(67, 97, 154);
    }
  }
  button {
    // display: none;
  }


</style>
