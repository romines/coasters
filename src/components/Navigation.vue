<template lang="html">

  <nav class="nav">

    <div class="nav-center">
      <span class="nav-item"  href="#">
        <!--  :class="" -->
        <router-link to="/" class="button" :class="{ 'is-active': navState.home }">Home</router-link>
      </span>
      <span class="nav-item" href="#">
        <router-link to="/history" class="button" :class="{ 'is-active': navState.history }">Picked Up</router-link>
      </span>
      <span class="nav-item" href="#">
        <router-link to="/new" class="button" :class="{ 'is-active': navState.post }">Post New</router-link>
      </span>
      <span class="nav-item" href="#">
        <span @click="logMeIn" class="button">Login</span>
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

  computed: {
    navState () {
      return {
        home: this.$store.state.route.path === '/',
        history: this.$store.state.route.path === '/history',
        post: this.$store.state.route.path === '/new',
      }
    }
  },

  methods: {
    logMeIn () {
      bus.$emit('msg', {
        type: bus.SHOW_MODAL,
        payload: {
          modalContent: 'login'
        }
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
