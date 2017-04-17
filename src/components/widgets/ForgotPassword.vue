<template lang="html">
	<div class="forgot-password">
		<h2 class='title is-4'>Enter email address</h2>
		<p class="control has-icon">
			<input v-model="email" class="input" type="email" placeholder="Email">
			<i class="fa fa-envelope"></i>
		</p>
		<button @click="submitEmailAddress" class="button is-primary">Submit</button>
		<div v-if="error" class="auth-error">{{error}}</div>

	</div>
</template>

<script>
// TODO: validate email
const emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export default {
	data () {
		return {
			email: ''
		}
	},
	methods: {
		submitEmailAddress () {
			console.log(this.email);
			this.$store.dispatch('sendPasswordReset', this.email)
		}
	},
	computed: {
		error () { return this.$store.state.authState.passwordResetError }
	}
}
</script>

<style lang="scss">
	.forgot-password {
		.auth-error {
			margin-top: .7em;
			color: red;
		}
	}
</style>
