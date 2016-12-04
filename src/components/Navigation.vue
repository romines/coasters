<template lang="html">
  <!-- <div class="navigation">

    <ul>
      <li>

      </li>
      <li>
        <router-link to="/post">New</router-link>
      </li>
      <li>
        <router-link to="/history">History</router-link>
      </li>
    </ul>
  </div> -->
  <nav class="nav">
    <div class="nav-center">
      <span class="nav-item"  href="#">
        <!--  :class="" -->
        <router-link to="/" class="button" :class="{ 'is-active': myProps.navState.home }">Home</router-link>
      </span>
      <span class="nav-item" href="#">
        <router-link to="/history" class="button" :class="{ 'is-active': myProps.navState.history }">Picked Up</router-link>
      </span>
      <span class="nav-item" href="#">
        <router-link to="/post" class="button" :class="{ 'is-active': myProps.navState.post }">Picked Up</router-link>
      </span>
    </div>
  </nav>
</template>

<script>
import bus from '../bus'

export default {
  data () {
    return {}
  },
  props: ['myProps'],

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

<style lang="scss" rel="stylesheet/scss">
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
