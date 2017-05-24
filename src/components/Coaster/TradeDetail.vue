<template lang="html">
	<div class="trade-detail" :class="{ expanded: viewingHistory }">

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
				<p>Posted:</p>
				<h3 class="title is-4 posted-by">{{originalPoster.name}}</h3>
				<p class="when-posted"><small>{{whenPosted}}</small></p>
			</div>
		</div>

		<div v-if="!!timeline">
			<div v-if="!viewingHistory" @click.stop="viewingHistory = true" class="view-history">
				<div class="elipsis">...</div>
				<div class="text">
					[Trade History]
				</div>
			</div>
			<div v-if="viewingHistory" class="timeline">
				<div class="history-title-bar">
					<div class="history-title title is-5">Trade History</div>
					<div class="fa fa-close" @click.stop="viewingHistory = false" ></div>
				</div>
				<div v-for="entry in timeline" class="entry">
					<div class="text">
						<span class="name">{{entry.name}}</span>
						<span class="type">{{entry.eventType}}</span>
					</div>
					<small class="time">{{entry.time}}</small>
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
					<p>Covering:</p>
					<h3 class="title">{{coaster.heldBy.name}}</h3>
				</div>
		</div>

	</div>
</template>

<script>
import moment from 'moment'
export default {
	props: ['coaster', 'whenPosted'],
	data () {
		return {
			viewingHistory: false
		}
	},
	methods: {
		toggleViewingHistory () {
			console.log('toggleViewingHistory . . .')
			this.viewingHistory = !this.viewingHistory
		}
	},
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
			// coaster is currently available. push last repost onto timeline entries array
			if (this.reposted) {
				entries[0] = {
					name: this.coaster.postedBy.name,
					time: moment(this.coaster.posted).format('MMM Do HH:mm'),
					eventType: 'reposted'
				}
			}
			let pickUpKeys = Object.keys(this.coaster.history).sort()
			// loop through shift trades backwards and push pickup and post events onto entries
			for (var i = pickUpKeys.length-1; i > 0; i--) {
				let key = pickUpKeys[i]
				let pickUp = this.coaster.history[key]
				entries.push({
					name: pickUp.pickedUpBy.name,
					time: moment(pickUp.pickedUp).format('MMM Do HH:mm'),
					eventType: 'picked up'
				})
				entries.push({
					name: pickUp.coveringFor.name,
					time: pickUp.posted,
					time: moment(pickUp.posted).format('MMM Do HH:mm'),
					eventType: 'reposted'
				})
			}
			// finally, push first pickup onto array
			let firstPickUp = this.coaster.history[pickUpKeys[0]]
			entries.push({
				name: firstPickUp.pickedUpBy.name,
				time: moment(firstPickUp.pickedUp).format('MMM Do HH:mm'),
				eventType: 'picked up'
			})
			return entries.reverse()

		}
	}
}
</script>

<style lang="scss">
.trade-detail {

	.title.posted-by {
		margin-bottom: 0;
	}
	&:not(.expanded) {
		.view-history {
			height: 48px;
			margin-top: -15px;
		}
	}
	.view-history {
		display: flex;
		align-items: center;
		.text { display: inline-block; }
		.elipsis {
			font-size: 4em;
			display: inline-block;
			transform: rotateZ(90deg);
			flex-shrink: 0;
			color: rgb(149, 149, 149)
		}
	}
	.history-title-bar {
		display: flex;
		justify-content: space-between;
		& > div { display: inline-block; }
		& > .title { margin-bottom: .6em; }
	}
	.entry {
		border: 1px solid grey;
		padding: .2em .4em;
		&:last-child { margin-bottom: .6em; }
		.type {
			font-weight: bold;
		}
	}

}
</style>
