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

		<div v-if="!!timeline" class="interim">
			<div class="elipsis">. . .</div>
			<div class="timeline">
				<div v-for="entry in timeline" class="entry">
					<span class="name">{{entry.name}}</span>
					<span class="type">{{entry.eventType}}</span>
					<span class="time">{{entry.time}}</span>
				</div>
			</div>
		</div>

		<div class="picked-up-by media">
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
</template>

<script>
import moment from 'moment'
export default {
	props: ['coaster', 'whenPosted'],
	computed: {
		reposted () {
			return this.coaster.history && this.coaster.available
		},
		originalPoster () {
			const historyKeys  = Object.keys(this.coaster.history)
			const firstKey     = historyKeys[0]
			return this.coaster.history[firstKey].coveringFor
		},
		timeline () {

			if (!(Object.keys(this.coaster.history).length > 1 || this.reposted)) return
			let entries = []
			if (this.reposted) {
				entries[0] = {
					name: this.coaster.postedBy.name,
					time: moment(this.coaster.posted).format('MMM Do'),
					eventType: 'reposted'
				}
			}
			let pickUpKeys = Object.keys(this.coaster.history).sort()
			console.log({pickUpKeys});
			for (var i = pickUpKeys.length-1; i > 0; i--) {
				let key = pickUpKeys[i]
				let pickUp = this.coaster.history[key]
				console.log({key, pickUp});
				entries.push({
					name: pickUp.pickedUpBy.name,
					time: moment(pickUp.pickedUp).format('MMM Do'),
					eventType: 'picked up'
				})
				entries.push({
					name: pickUp.coveringFor.name,
					time: pickUp.posted,
					time: moment(pickUp.posted).format('MMM Do'),
					eventType: 'reposted'
				})
			}
			let firstPickUp = this.coaster.history[pickUpKeys[0]]
			entries.push({
				name: firstPickUp.pickedUpBy.name,
				time: moment(firstPickUp.pickedUp).format('MMM Do'),
				eventType: 'picked up'
			})
			console.log(entries);
			return entries.reverse()

		}
	}
}
</script>

<style lang="scss">
	.title.posted-by {
		margin-bottom: 0;
	}
	.interim {
		margin-bottom: 10px;
		display: flex;
	}
	.elipsis {
		font-size: 4em;
		display: inline-block;
		transform: rotateZ(90deg);
		flex-shrink: 0;
		color: rgb(149, 149, 149)
	}
</style>
