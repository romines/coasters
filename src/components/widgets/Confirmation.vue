<template lang="html">
  <div class="confirmation">
		<div class="question">
			{{message}}
		</div>
		<span class="button is-primary">Confirm</span>
		<span @click="close" class="button">Cancel</span>
  </div>
</template>

<script>
export default {

	data () {
		return {}
	},
	props: ['message'],

	methods: {
    close () {
      this.$store.commit('CLOSE_MODAL')
    }
  }
}
</script>

<style lang="css">
</style>
