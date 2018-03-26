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
				<p><span v-if="!!timeline">Originally </span>Posted:</p>
				<h3 class="title is-4 posted-by">{{originalPoster.name}}</h3>
				<span class="mini-top-level-comment">{{coaster.comment}}</span>
			</div>
		</div>

		<div v-if="!!timeline">
			<div v-if="!viewingHistory" @click.stop="viewingHistory = true" class="view-history">
				<div class="elipsis">...</div>
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
					<p v-if="reposted">Responsible For:</p>
					<p v-if="!reposted">Covering:</p>
					<h3 class="title">{{coaster.heldBy.name}}</h3>
				</div>
		</div>

	</div>
</template>

<script>
import moment from 'moment'
export default {
	props: ['coaster', 'whenPosted'],
	data() {
		return {
			viewingHistory: false
		}
	},
	methods: {
		toggleViewingHistory() {
			console.log('toggleViewingHistory . . .')
			this.viewingHistory = !this.viewingHistory
		}
	},
	computed: {
		reposted() {
			return this.coaster.history && this.coaster.available
		},
		originalPoster() {
			const historyKeys = Object.keys(this.coaster.history)
			const firstKey = historyKeys[0]
			return this.coaster.history[firstKey].coveringFor
		},

		timeline() {

			const getActor = (historyItem) => {
				return (historyItem.type === 'TRADE') ? 'pickedUpBy' : 'committedBy'
			}

			const getEventType = (historyItem) => {
				switch (historyItem.type) {
					case 'REPOST':
						return 'reposted'
					case 'CANCEL':
						return 'cancelled'
					default:
						return 'picked up'
				}
			}

			if (!(Object.keys(this.coaster.history).length > 1 || this.reposted)) return

			return Object.keys(this.coaster.history).map((key) => {
				let historyItem = this.coaster.history[key]
				return {
					name: historyItem[getActor(historyItem)].name,
					time: moment(historyItem.posted).format('MMM Do HH:mm'),
					eventType: getEventType(historyItem)
				}
			})

		}
	}
}
</script>

<style lang="scss">
.trade-detail {
	.posted-by {
		align-items: center;
	}
	.media-left figure.user img,
	.media-left figure.user .icon {
		width: 84px;
		height: 84px;
	}
  .mini-top-level-comment {
    margin-top: .5em;
    font-size: .78em;
    line-height: 1.46em;
    display: inline-block;
  }
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
		.text {
			display: inline-block;
		}
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
		&>div {
			display: inline-block;
		}
		&>.title {
			margin-bottom: .6em;
		}
	}
	.entry {
		border: 1px solid grey;
		padding: .2em .4em;
		&:last-child {
			margin-bottom: .6em;
		}
		.type {
			font-weight: bold;
		}
	}
}
</style>
