<template lang="html">
  <div class="navigation">
    <div v-if="burgerActive" class="nav-mask" @click='burgerActive = !burgerActive'>

    </div>
    <nav class="nav">
      <div class="container">
        <div class="nav-left">
          <a class="nav-item is-brand" href="#">
            SRB Coasters
          </a>
        </div>


        <span @click='burgerActive = !burgerActive' class="nav-toggle">
          <span></span>
          <span></span>
          <span></span>
        </span>

        <div :class="{ 'is-active' : burgerActive}" class="nav-right nav-menu">
          <span class="nav-item"  href="#">
            <a @click="toHome" class="button" :class="{ 'is-active': navState.home }">
              <i class="fa fa-home"></i>
              <span class="text-only">Home</span>
            </a>
          </span>
          <span class="nav-item" href="#">
            <a @click="toHistory" class="button" :class="{ 'is-active': navState.history }">
              <i class="fa fa-history"></i>
              <span class="text-only">History</span>
            </a>
          </span>
          <span class="nav-item" @click='burgerActive = !burgerActive' href="#">
            <router-link to="/new" class="button" :class="{ 'is-active': navState.post }">
              <i class="fa fa-plus"></i>
              <span class="text-only">Post New</span>
            </router-link>
          </span>
          <span v-show="!authState.user" class="nav-item" href="#">
            <span @click="launchLoginModal" class="button">Login</span>
          </span>
          <span v-show="authState.user" class="nav-item welcome-user">
            {{displayName}} <i class="fa fa-user"></i>
          </span>

        </div>

      </div>


    </nav>
  </div>


</template>

<script>
import bus from '../bus'
import router from '../router'


export default {
  data () {
    return {
      burgerActive: false
    }
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
    toHome () {
      router.push({ path: '/' })
      this.$store.dispatch('getCoasters')
      this.burgerActive = false
    },
    toHistory () {
      router.push({ path: '/history' })
      this.$store.dispatch('getCoasters')
      this.burgerActive = false
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
@import '../../node_modules/bulma/sass/utilities/mixins.sass';
.nav-mask {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    transition: opacity .3s ease;
}
.nav {
  padding-bottom: .6em;
  margin-bottom: .6em;
  z-index: 11;

  .fa-user { margin-left: .7em; }

  .text-only {
    @include desktop {
      display: none;
    };
  }

}
</style>
