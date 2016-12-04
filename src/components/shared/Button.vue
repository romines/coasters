<template lang="html">
	<button @click="run" class="pill">
		Hi, I'm a button
	</button>
</template>

<script>
export default {
	props: ['onClick', 'ocArgs'],
	methods: {
		run () {
			if (this.ocArgs) {
				this.onClick(this.ocArgs)
			}
		}
	}
}
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
