<template lang="html">
  <div class="user">
    <h1 class="title header">My Coasters</h1>

    <div class="media">
      <div class="media-left">
        <figure class="posted-by-user">
          <img v-if="user.photoURL" :src="user.photoURL" alt="">
          <span v-if="!user.photoURL" class="icon is-large">
            <i class="fa fa-user"></i>
          </span>
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

    <section class="posted-shifts">
      <span class="title is-5">Posted Shifts</span>
      <list :coasters="myPostedCoasters" :options="{noFilters: true}"></list>
    </section>

  </div>
</template>

<script>
import List from '../List.vue'
import router from '../../router'
export default {
  data () {
    return {}
  },
  computed: {
    user () {
      return this.$store.state.authState.user
    },
    myPostedCoasters () {
      return this.$store.state.coasters.filter((coaster) => {
        return coaster.postedBy.uid === this.user.uid
      })
    }
  },
  components: {
    List
  },
  mounted () {
    // if (!this.)
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

  .posted-shifts {
    padding-top: 1em;
    margin-top: 1em;
    border-top: 1px solid rgb(117, 117, 117);
  }


}
</style>
