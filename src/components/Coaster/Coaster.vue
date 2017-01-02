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
            <figure class="posted-by-user-icon image is-32x32">

              <i class="fa fa-user"></i>
            </figure>
          </div>
          <div class="media-content">
            <p class="title">Amy Joe</p>
          </div>
        </div>
        <div class="content">
          {{ coaster.comment }}</br>

          <small>Posted:</small>
          <action-buttons></action-buttons>
          <textarea v-if="isCommenting && isDetailView" class="textarea"></textarea>

        </div>
      </div>


    </div>
  </div>
</template>

<script>
import router from '../../router'
import moment from 'moment'
import mixins from '../../mixins'
import * as myButton from '../widgets/Button.vue'
import ActionButtons from './ActionButtons.vue'
console.log(ActionButtons);
export default {
  components: {
    ActionButtons,
    myButton
  },
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

  }
}
</script>

<style lang="scss" rel="stylesheet/scss">

.coaster {
  &:hover {
    cursor: pointer;
  }
  .media-left {
    text-align: center;
    .fa-user {
      vertical-align: middle;
      line-height: inherit;
    }
  }

}


</style>
