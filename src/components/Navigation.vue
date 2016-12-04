<template lang="html">
  <div class="navigation">

    <ul>
      <li>
        <router-link to="/">Home</router-link>
      </li>
      <li>
        <router-link to="/post">New</router-link>
      </li>
      <li>
        <router-link to="/history">History</router-link>
      </li>
    </ul>
    <span @click="changeList()" class="coaster-category">Picked Up</span>
    <!-- <span class="coaster-category"></span> -->
    <!-- <span class="coaster-category">Old</span> -->
  </div>
</template>

<script>
import bus from '../bus'
export default {
  data () {
    return {}
  },
  methods: {
    changeList (e) {
      bus.$emit('msg', {
        type: bus.CHANGE_LIST,
        payload: {}
      })
    }
  }
}
</script>

<style lang="sass">
.navigation {
  padding-bottom: .6em;
  margin-bottom: .6em;
  .coaster-category {
    display: inline-block;
    padding: .3em;
    background-color: rgb(173, 107, 115);
  }
}
</style>
