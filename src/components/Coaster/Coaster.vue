<template lang="html">
  <div v-if="coaster" @click="makeDetail()" class="coaster">

    <div class="card is-fullwidth">

      <header class="card-header">
        <p class="card-header-title">
          {{ getTitle(coaster) }}
        </p>
        <a v-if="isDetailView" @click="closeDetailView" class="card-header-icon">
          <i class="fa fa-close"></i>
        </a>
      </header>

      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="image is-32x32">
              <img src="http://placehold.it/64x64" alt="Image">
            </figure>
          </div>
          <div class="media-content">
            <p class="title">Posted by:</p>
          </div>
        </div>
        <div class="content">
          {{ coaster.comment }}</br>


          <textarea v-if="isCommenting && isDetailView" class="textarea"></textarea>

          <small>{{ coaster.date }} - {{ coaster.time }}</small>
        </div>
      </div>
      <footer v-if="isDetailView" class="card-footer">
        <a class="card-footer-item">Pick Up</a>
        <a @click="startCommenting()" class="card-footer-item">Comment</a>
        <a class="card-footer-item">Delete</a>
      </footer>
    </div>
  </div>
</template>

<script>
import router from '../../router'
import moment from 'moment'
import mixins from '../../mixins'
import * as myButton from '../widgets/Button.vue'
export default {
  mixins: [mixins],
  data () {
    return {
      localComment: '',
      isCommenting: false
    }
  },
  props: ['coasterAsProp', 'as'],
  computed: {
    coaster () {
      return this.coasterAsProp ? this.coasterAsProp : this.$store.getters.detailCoaster
    },

    isDetailView () {
      return this.$store.state.route.name === 'detail'
    }
  },
  methods: {

    makeDetail (coaster) {
      if (!this.coaster) return
      router.push({ name: 'detail', params: { id: this.coaster.key }})
    },
    closeDetailView () {
      router.push({ path: '/'})
    },
    startCommenting () {
      this.isCommenting = true;
    },
    cancelComment () {
      this.isCommenting = false;
    },
    getTitle:  function (coaster) {
      if (coaster) {
        return moment(coaster.date).format('dddd, MMM Do') + ' | ' + coaster.time + ' | ' + coaster.shiftType
      }
    },

  },
  components: {
    myButton
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">

.coaster {
  &:hover {
    cursor: pointer;
  }

}


</style>
