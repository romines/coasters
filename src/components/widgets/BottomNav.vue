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

		<span v-show="authState.user" @click="toUserHome" class="bottom-nav-item user">
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
		toUserHome () {
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

<style lang="scss">
	// TODO: get node package import working inside style loader
	@import '../../../node_modules/bulma/sass/utilities/mixins.sass';
	.bottom-nav {
		height: 11vh;
		width: 100%;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: #4679c7;

		.bottom-nav-item {
			color: rgb(33, 33, 33);
			.fa {
				font-size: 6.5vh;
			}
		}
		@include desktop {
			display: none;
		};
	}
</style>
