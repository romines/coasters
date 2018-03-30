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
              <span class="icon"><i class="fa fa-handshake"></i></span>
              <span class="text-only">Picked Up</span>
            </a>
          </span>

          <span :class="{ 'is-active': navState.post }" class="nav-item">
            <a @click.stop="toNew" class="title">
              <span class="icon"><i class="fa fa-plus"></i></span>
              <span class="text-only">Post New</span>
            </a>
          </span>

          <span class="nav-item user" >
            <a class="title" @click="toUserHome">
              <span class="icon"><i class="fa fa-user" /></span>
              <span v-show="!authState.user" class="text-only" @click.stop="launchLoginModal">Login</span>
              <span v-show="authState.user" class="text-only">My Coasters</span>
            </a>
            <i v-show="authState.user" class="fa fa-power-off" @click="logOut" />

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
    userEmail () {
      if (!this.authState.user) return
      return this.authState.user.email
    },
    displayName () {
      if (!this.$store.state.userData) return
      return this.$store.state.userData.displayName
    },
    userKey () {
      if (!this.authState.user) return
      return this.authState.user.uid
    },
    navState () {
      return {
        home: this.$store.state.route.path === '/',
        history: this.$store.state.route.path === '/picked-up',
        post: this.$store.state.route.path === '/post',
      }
    }
  },

  methods: {
    launchLoginModal () {
      this.$store.commit('SHOW_MODAL', {component: 'Login'})
    },
    logOut () {
      router.push('/')
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
      if (!this.$store.state.authState.user) {
				this.$store.commit('SHOW_MODAL', {
          component:'Login',
					heading: 'Please Login/Sign Up',
					message: 'You must login before posting coasters',
					onSuccess () {
						router.push({ path: '/post' })
					}
        })
			} else {
				router.push({ path: '/post' })
			}
      this.burgerActive = false
    },
    toUserHome () {
      if (!this.$store.state.authState.user) {
				this.$store.commit('SHOW_MODAL', {
          component:'Login',
					heading: 'Please Login/Sign Up',
					message: 'You must login before viewing this page',
					onSuccess () {
						router.push({
              name: 'user',
              params: {
                uid: this.$store.state.authState.user.uid
                }
              }
            )
					}
        })
			} else {
        router.push({
          name: 'user',
          params: {
            uid: this.userKey
          }
        })
			}
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
      & > span {
        margin-left: 0 !important;
        transform: translateX(-50%);
        height: 2px;
        width: 23px;

        &:nth-child(1) {
          margin-top: -8px;
        }
        &:nth-child(2) {
          margin-top: -2px;
        }
      }
    }
    .nav-item {
      text-align: left;
      .title:not(:last-child) {
        // margin-bottom: 10px;
      }
    }
    .fa-power-off {
      // position: absolute;
      // right: 1em;
    }
  }

  .is-brand {
    color: rgb(33, 33, 33);
  }

  @include mobile {
    .nav-item {

      .title {
        display: flex;
        align-items: center;
        margin-bottom: 0;
      }

      .icon {
        width: 2.5em;
        border-right: 1px solid grey;
        padding-right: .5em;
        margin-right: .5em;

      }
      .text-only {
        font-size: .8em;
      }
      &.user {
        position: relative;
        .fa-power-off {
          position: relative;
          right: .6em;
        }
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
      }
      .fa-power-off {
        position: static;
        margin-left: 1.2em;
      }
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
  }
}




</style>
