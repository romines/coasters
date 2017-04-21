<template lang="html">
  <div v-if="user" class="user">
    <h1 class="title header">My Coasters</h1>

    <div class="media">
      <div class="media-left">
        <figure class="user">
          <image-upload>
            <span slot="title"></span>
          </image-upload>

        </figure>
      </div>

      <div class="media-content">
        <ul>
          <li>{{user.displayName}}</li>
          <li>{{user.email}}</li>
          <li><a @click="logOut">Log out</a></li>
        </ul>
      </div>
    </div>

    <section class="notifications">
      <div v-for="notification in notifications" :key="notification.key" class="notification is-primary">
        <button class="delete"></button>
        {{notification.message}}
      </div>
    </section>

    <section class="posted-shifts">
      <span class="title is-5">Posted Shifts</span>
      <ul>
        <coaster :options="{}" v-for="coaster in myPostedCoasters" :coaster="coaster" :key="coaster.key"></coaster>
      </ul>
    </section>

    <section class="posted-shifts">
      <span class="title is-5">Shifts I'm Covering</span>
      <ul>
        <coaster :options="{}" v-for="coaster in myPickedUpCoasters" :coaster="coaster" :key="coaster.key"></coaster>
      </ul>
    </section>

  </div>
</template>

<script>
import List from '../List.vue'
import Coaster from '../Coaster/Coaster.vue'
import ImageUpload from '../widgets/ImageUpload.vue'
import router from '../../router'

export default {
  data () {
    return {}
  },
  computed: {
    user () {
      return this.$store.state.authState.user
    },

    notifications () {
      return this.$store.state.notifications
    },

    myPostedCoasters () {
      return this.$store.state.coasters.filter((coaster) => {
        return coaster.postedBy.uid === this.user.uid
      })
    },

    myPickedUpCoasters () {

      return this.$store.state.coasters
      .filter((coaster) => {
        return coaster.heldBy
      })
      .filter((coaster) => {
        return coaster.heldBy.uid === this.user.uid && coaster.history
        // let history = coaster.history
        // let lastPickup
        // for(var item in history) {
        //     lastPickup = history[item]
        // }

        // return lastPickup.pickedUpBy.uid === this.user.uid

      })

    }
  },
  components: {
    Coaster,
    ImageUpload
  },

  methods: {
    logOut () {
      router.push('/')
      this.$store.dispatch('logOutUser')
    }

  }

}
</script>

<style lang="scss">
.user {
  .media img {
    width: 74px;
    height: 74px;
    object-fit: cover;
  }
  .media-left {
    max-width: 50%;
  }
  .posted-shifts {
    padding-top: 1em;
    margin-top: 1em;
    border-top: 1px solid rgb(117, 117, 117);
  }


}
</style>
