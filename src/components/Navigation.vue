<template lang="html">

  <nav class="nav">

    <div class="nav-center">
      <span class="nav-item"  href="#">
        <!--  :class="" -->
        <router-link to="/" class="button" :class="{ 'is-active': navState.home }">Home</router-link>
      </span>
      <span class="nav-item" href="#">
        <span @click="toHistory" class="button" :class="{ 'is-active': navState.history }">Picked Up</span>
      </span>
      <span class="nav-item" href="#">
        <router-link to="/new" class="button" :class="{ 'is-active': navState.post }">Post New</router-link>
      </span>
      <span v-show="!authState.user" class="nav-item" href="#">
        <span @click="launchLoginModal" class="button">Login</span>
      </span>
      <span v-show="authState.user" class="nav-item" href="#">
        <span @click="logOut" class="button">Logout</span>
      </span>
    </div>

  </nav>

</template>

<script>
import bus from '../bus'
import router from '../router'


export default {
  data () {
    return {}
  },
  props: ['myProps'],

  computed: {
    authState () {
      return this.$store.state.authState
    },
    navState () {
      return {
        home: this.$store.state.route.path === '/',
        history: this.$store.state.route.path === '/history',
        post: this.$store.state.route.path === '/new',
      }
    }
  },

  methods: {
    launchLoginModal () {
      this.$store.commit('SHOW_MODAL')
    },
    logOut () {
      this.$store.dispatch('logOutUser')
    },
    toHistory () {
      router.push({ path: '/history' })
      this.$store.dispatch('getCoasters')
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
