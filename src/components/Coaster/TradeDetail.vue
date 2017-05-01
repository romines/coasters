<template lang="html">
	<div class="trade-detail">

		<div class="posted-by media">
			<div class="media-left">
				<figure class="user">
					<img v-if="originalPoster.photoURL" :src="originalPoster.photoURL" alt="">
					<span v-if="!originalPoster.photoURL" class="icon is-large">
						<i class="fa fa-user"></i>
					</span>
				</figure>
			</div>

			<div class="media-content">
				<p>Originally posted by:</p>
				<h3 class="title posted-by">{{originalPoster.name}}</h3>
				<p class="when-posted"><small>{{whenPosted}}</small></p>
			</div>
		</div>

		<div class="picked-up-by">
			<div class="posted-by media">
				<div class="media-left">
					<figure class="user">
						<img v-if="coaster.heldBy.photoURL" :src="coaster.heldBy.photoURL" alt="">
						<span v-if="!coaster.heldBy.photoURL" class="icon is-large">
							<i class="fa fa-user"></i>
						</span>
					</figure>
				</div>

				<div class="media-content">
					<p v-if="!reposted">Covering:</p>
					<p v-if="reposted">Responsible for:</p>
					<h3 class="title">{{coaster.heldBy.name}}</h3>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
export default {
	props: ['coaster', 'whenPosted'],
	computed: {
		reposted () {
			return this.coaster.history && this.coaster.available
		},
		originalPoster () {
			const historyKeys  = Object.keys(this.coaster.history)
			const firstKey     = historyKeys[0]
			console.log(this.coaster.history[firstKey].coveringFor);
			return this.coaster.history[firstKey].coveringFor
		},
		interimHolds () {
			if (Object.key(this.coaster.history).length < 2) return

		}
	}
}
</script>

<style lang="scss">
	.title.posted-by {
		margin-bottom: 0;
	}
</style>
