<template lang="html">

  <nav class="nav">
    <div class="nav-left">
      <a class="nav-item is-brand" href="#">
        SRB Coasters
      </a>
    </div>

    <div class="nav-center">
      <span class="nav-item"  href="#">
        <router-link to="/" class="button" :class="{ 'is-active': navState.home }">
          <i class="fa fa-home"></i>
        </router-link>
      </span>
      <span class="nav-item" href="#">
        <span @click="toHistory" class="button" :class="{ 'is-active': navState.history }">
          <i class="fa fa-history"></i>
        </span>
      </span>
      <span class="nav-item" href="#">
        <router-link to="/new" class="button" :class="{ 'is-active': navState.post }">
          <i class="fa fa-plus"></i>
        </router-link>
      </span>

    </div>

    <div class="nav-right nav-menu">
      <span v-show="!authState.user" class="nav-item" href="#">
        <span @click="launchLoginModal" class="button">Login</span>
      </span>
      <span v-show="authState.user" class="nav-item welcome-user">
       {{displayName}} <i class="fa fa-user"></i>
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
    displayName () {
      if (!this.authState.user) return
      return this.authState.user.displayName ? this.authState.user.displayName : this.authState.user.email
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
.nav {
  padding-bottom: .6em;
  margin-bottom: .6em;
  
  .fa-user { margin-left: .7em; }

}
</style>
