<template lang="html">
  <div class="confirmation">
		<h4 class="title is-4">{{contents.heading}}</h4>
		<div class="question" v-if="contents.message && contents.message.length">
			{{contents.message}}
		</div>

    <div class="action-buttons">
      <span v-for="button in contents.buttons" @click="button.action" :class="button.classList" class="button">{{button.label}}</span>
      <span @click="close" class="button" v-if="!contents.hideCancel">Cancel</span>
    </div>

  </div>
</template>

<script>
export default {

	data () {
		return {}
	},
	props: ['contents'],
created () {console.log(this.contents);}, // TODO temp . . .
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

<style lang="scss">
  .action-buttons {
    padding-top: 1em;
    display: flex;
    justify-content: space-around;
    .button {
      margin-right: .3em;
    }
  }
</style>
