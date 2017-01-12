<template lang="html">
  <div class="navigation">
    <div v-if="burgerActive" class="nav-mask" @click='burgerActive = !burgerActive'>

    </div>
    <nav class="nav">
      <div class="container">
        <div class="nav-left">
          <a class="nav-item is-brand title" @click="toHome">
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
              <i class="icon-only fa fa-home"></i>
              <span class="text-only">Home</span>
            </a>
          </span>
          <span class="nav-item" href="#">
            <a @click="toHistory" class="button" :class="{ 'is-active': navState.history }">
              <i class="icon-only fa fa-handshake-o"></i>
              <span class="text-only">Picked Up</span>
            </a>
          </span>
          <span class="nav-item" href="#">
            <a @click="toNew" class="button" :class="{ 'is-active': navState.post }">
              <i class="icon-only fa fa-plus"></i>
              <span class="text-only">Post New</span>
            </a>
          </span>
          <span v-show="!authState.user" class="nav-item" href="#">
            <span @click="launchLoginModal" class="button">Login</span>
          </span>
          <span v-show="authState.user" class="nav-item user">
            <i class="icon-only fa fa-user"></i>
            <span class="display-name">{{displayName}}</span>
            <span @click="logOut"><i class="fa fa-power-off"></i></span>
          </span>

        </div>

      </div>


    </nav>
  </div>


</template>

<script>
import router from '../../router'


export default {
  data () {
    return {
      burgerActive: false,
      userMenuActive: true
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
        history: this.$store.state.route.path === '/picked-up',
        post: this.$store.state.route.path === '/new',
      }
    }
  },

  methods: {
    launchLoginModal () {
      this.$store.commit('SHOW_MODAL', {component: 'Login'})
    },
    logOut () {
      this.$store.dispatch('logOutUser')
    },
    toHome () {
      router.push({ path: '/' })
      this.burgerActive = false
    },
    toHistory () {
      router.push({ path: '/picked-up' })
      this.burgerActive = false
    },
    toNew () {
      router.push({ path: '/new' })
      this.burgerActive = false
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
// TODO: get node package import working inside style loader
@import '../../../node_modules/bulma/sass/utilities/mixins.sass';
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

  @include mobile {
    background-color: #23d482;
    height: 11vh;
    .nav-toggle {
      height: 11vh;
      width: 11vh;
    }
  }

  .is-brand {
    color: rgb(33, 33, 33);
  }
  .icon-only {
    display: none;
    @include desktop {
      display: inline;
    };
  }

  .fa-user, .display-name { margin: 0 .7em; }

  // .fa-power-off {}

  .text-only {
    @include desktop {
      display: none;
    };
  }

  .user { justify-content: center; }

}
</style>
