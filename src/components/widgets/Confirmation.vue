<template lang="html">
  <div class="confirmation">
		<h4 class="title is-4">{{contents.heading}}</h4>
		<div class="question">
			{{contents.message}}
		</div>
    <span v-for="button in contents.buttons" @click="button.action" :class="button.classList" class="button">{{button.label}}</span>
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
    },
		confirm () {
			this.contents.actions.onConfirm()
			this.$store.commit('CLOSE_MODAL')
		}
  }
}
</script>

<style lang="css">
</style>
