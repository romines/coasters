<template lang="html">
	<div class="bottom-nav">

		<span @click="toHome" class="bottom-nav-item"  :class="{ 'is-active': navState.home }">
			<i class="fa fa-home"></i>
		</span>

		<span @click="toHistory" class="bottom-nav-item"  :class="{ 'is-active': navState.history }">
			<i class="fa fa-handshake-o"></i>
		</span>

		<span @click="toNew" class="bottom-nav-item"  :class="{ 'is-active': navState.post }">
			<i class="fa fa-plus"></i>
		</span>

		<span @click="toUserHome" class="bottom-nav-item user" :class="{ 'is-active': navState.userHome }">
			<i class="fa fa-user"></i>
		</span>

	</div>

</template>

<script>

import router from '../../router'
export default {
	computed: {
    authState () {
      return this.$store.state.authState
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
        userHome: this.$store.state.route.path.startsWith('/user'),
      }
    }
  },
	// TODO: use navigation guards?
	methods: {
		launchLoginModal () {
			this.$store.commit('SHOW_MODAL', {component: 'Login'})
		},

		toUserHome () {
      if (!this.$store.state.authState.user) {
        this.$store.commit('SHOW_MODAL', {
          component:'Login',
					heading: 'Please Login',
					message: 'You must login before viewing this page',
					onSuccess (key) {
						router.push({
							name: 'user',
							params: {
								key: key
							}
						})
					}
        })
      } else {
        router.push({
          name: 'user',
          params: {
            key: this.userKey
          }
        })
      }
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
						router.push({ path: '/new' })
					}
        })
			} else {
				router.push({ path: '/new' })
			}
		}
	}
}
</script>

<style lang="scss">
	// TODO: get node package import working inside style loader
	@import '../../../node_modules/bulma/sass/utilities/mixins.sass';
	.safari .bottom-nav {
		// bottom: 44px;
		// margin-bottom: -44px;
	}
	.fullscreen.safari .bottom-nav {
		margin-bottom: 0;
		h1.title.header {
			color: red;
		}
	}

	.bottom-nav {
		// height: 11vh;
		max-width: 100%;
		width: 100%;
		// width: 260px;
		position: fixed;
		bottom: 0;
		white-space:nowrap;
		overflow:hidden;
		// display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: #4679c7;

		.bottom-nav-item {
			display: inline-block;
			padding: 1em 0;
			width: 25%;
			margin-right: -3px;
			text-align: center;
			color: rgb(33, 33, 33);
			.fa {
				font-size: 6.5vh;
			}
			&.is-active {
				background-color: #344c71;
				color: #ececec;
			}
		}
		@include desktop {
			display: none;
		};
	}
</style>
