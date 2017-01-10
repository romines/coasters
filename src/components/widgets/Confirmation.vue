<template lang="html">
  <div class="confirmation">
		<h4 class="title is-4">{{contents.heading}}</h4>
		<div class="question">
			{{contents.message}}
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
	props: ['contents'],

	methods: {
    close () {
      this.$store.commit('CLOSE_MODAL')
    }
  }
}
</script>

<style lang="css">
</style>
