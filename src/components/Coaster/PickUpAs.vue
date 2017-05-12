<template lang="html">
  <div class="pick-up-as">
  	<span class="title is-4">Pick Up Shift As User</span>
		<input v-model="searchString" class="input" placeholder="Enter your full name">
  </div>
</template>

<script>
export default {
	data () {
    return {
      searchString: ''
    }
  },
}
</script>

<style lang="scss">
</style>
