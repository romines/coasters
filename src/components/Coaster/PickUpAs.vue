<template lang="html">
  <div class="pick-up-as">
  	<span class="title is-4">Pick Up As</span>

    <div class="pick-up-as-user media">
      <div class="media-left">
        <figure class="user">
          <img v-if="contents.props.user.photoURL" :src="contents.props.user.photoURL" class="image is-48x48">
          <span v-if="!contents.props.user.photoURL" class="icon is-large">
            <i class="fa fa-user"></i>
          </span>
        </figure>
      </div>
      <div class="media-content">
        <span class="user-name title is-5">{{contents.props.user.displayName}}</span>
      </div>
    </div>

    <confirmation :contents="contents"></confirmation>
  </div>
</template>

<script>
import Confirmation from '../widgets/Confirmation.vue'

export default {
	data () {
    return {
    }
  },
  components: { Confirmation },
  created () {
    console.log(this.$store.state.modal.contents.props);
  },
	computed: {
		contents () {
      const confirmPickupAs = (user) => {
        this.$store.commit('SHOW_MODAL', {
          component:'PickUpAs',
          props: {...this.contents.props, user}
        })
      }
      const pickItUp = () => {
        this.$store.dispatch('pickUpCoaster', {...this.contents.props})
        this.$store.commit('CLOSE_MODAL')
      }
      const searchAgain = ()  => {
        this.$store.commit('SHOW_MODAL', {component: 'UserSearch', props: {
          coaster: {...this.contents.props.coaster},
          onUserClick: confirmPickupAs
          }
        })
      }
      return {
        ...this.$store.state.modal.contents,
        buttons: [
          {
            label: 'Pick Up',
            action: pickItUp,
            classList: 'is-primary'
          },
          {
            label: 'Search Again',
            action: searchAgain
          }
        ]
      }
		}
	},
  methods: {

  }
}
</script>

<style lang="scss">
.pick-up-as {
  .title {
    display: block;
    margin-bottom: .5em;
  }
  .user {
    img {
      object-fit: cover;
      object-position: center;
    }
  }
}
</style>
