<template lang="html">
  <div class="user-search">
  	<span class="title is-4">Pick Up Shift As User</span>
		<input v-model="searchString" class="input" placeholder="Enter part of the user's name">
		<ul class="results-list">
			<li v-for="user in searchResults" class="result" @click="onUserClick(user)">
				<span class="name">{{user.displayName}}</span>
			</li>
		</ul>
  </div>
</template>

<script>
export default {
	data () {
    return {
      searchString: ''
    }
  },
	computed: {
		searchResults () {
			if (this.searchString.length < 2) return []
			return this.$store.state.usersList.filter((user) => {
        if (!user.displayName) return false
				return user.displayName.toLowerCase().includes(this.searchString.toLowerCase())
			})
		}
	},
  methods: {
    onUserClick (user) {
      this.$store.state.modal.contents.props.onUserClick(user)
      this.searchString = ''
    }
  }

}
</script>

<style lang="scss">
.user-search {
	.result {
		border: 1px solid grey;
		padding: .3em;
	}
}
</style>
