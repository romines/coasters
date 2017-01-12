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
          <span :class="{ 'is-active': navState.home }" class="nav-item">
            <a @click.stop="toHome" class="title">
              <span class="icon"><i class="fa fa-home"></i></span>
              <span class="text-only">Home</span>
            </a>
          </span>

          <span :class="{ 'is-active': navState.history }" class="nav-item">
            <a @click.stop="toHistory" class="title">
              <span class="icon"><i class="fa fa-handshake-o"></i></span>
              <span class="text-only">Picked Up</span>
            </a>
          </span>

          <span :class="{ 'is-active': navState.post }" class="nav-item">
            <a @click.stop="toNew" class="title">
              <span class="icon"><i class="fa fa-plus"></i></span>
              <span class="text-only">Post New</span>
            </a>
          </span>

          <span @click="toUserHome" class="nav-item user" >
            <a class="title">
              <span class="icon"><i class="fa fa-user"></i></span>

              <span v-show="!authState.user" @click.stop="launchLoginModal" class="text-only title">Login</span>
              <span v-show="authState.user" class="text-only">{{displayName}}</span>
            </a>
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
    userKey () {
      if (!this.authState.user) return
      return this.authState.user.uid
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
      console.log('something is calling "toHome"');
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
    },
    toUserHome () {
      router.push({
        name: 'user',
        params: {
          key: this.userKey
        }
      })
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
  .nav-item.is-active {
    background-color: whitesmoke;
    & * {
      color: black;
    }

  }
  .icon {
    vertical-align: middle;
    line-height: 1;
  }
  .title {
    line-height: normal;
  }
  z-index: 11;

  @include mobile {

    background-color: #23d482;
    height: 11vh;
    .nav-toggle {
      height: 11vh;
      width: 11vh;
    }
    .nav-item {
      text-align: left;
    }
  }

  .is-brand {
    color: rgb(33, 33, 33);
  }

  @include mobile {
    .nav-item {

      display: flex;
      align-items: center;
      & > * {
        // line-height: 0.8em;
        vertical-align: middle;

      }
      .icon {
        width: 2.5em;
        border-right: 1px solid grey;
        padding-right: .5em;
        margin-right: .5em;

      }
      .text-only {
        font-size: .8em;
        // display: none;
      }

    }
  }
  @include tablet {

    border-bottom: 1px solid grey;
    .text-only {
      display: none;
    }
    .user {
      font-size: 28px;
      .icon{
        float: right;
        padding: .2em;
      }
      // margin-right: -1em;
    }
  }
  @include desktop {
    .text-only {
      display: flex;
      font-size: .8em;
    }
    .icon {
      display: none;
    }
    .user .icon {
      display: flex;
    }
  }
}




</style>
