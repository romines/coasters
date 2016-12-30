<template lang="html">
  <div v-if="coaster" class="coaster">
    <div class="card is-fullwidth">
      <header class="card-header">
        <p class="card-header-title">
          {{ getTitle(coaster) }} | {{ coaster.key }}
        </p>
        <a class="card-header-icon">
          <i class="fa fa-angle-down"></i>
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
            <p class="title is-5">Is Commenting: {{ commenting.isCommenting }}</p>
            <p class="subtitle is-6">@johnsmith</p>
          </div>
        </div>
        <div class="content">
          {{ coaster.comment }}</br>


          <textarea v-if="commenting.isCommenting && isDetailView" class="textarea"></textarea>

          <small>{{ coaster.date }} - {{ coaster.time }}</small>
        </div>
      </div>
      <footer class="card-footer">
        <a @click="makeDetail()" class="card-footer-item">Pick Up</a>
        <a @click="startCommenting()" class="card-footer-item">Comment</a>
        <a class="card-footer-item">Delete</a>
      </footer>
    </div>
  </div>
</template>

<script>
import bus from '../../bus'
import router from '../../router'
import moment from 'moment'
import mixins from '../../mixins'
import * as myButton from '../widgets/Button.vue'
export default {
  mixins: [mixins],
  data () {
    return {
      localComment: ''
    }
  },
  props: ['coasterAsProp', 'as'],
  computed: {
    coaster () {
      return this.coasterAsProp ? this.coasterAsProp : this.$store.getters.detailCoaster
    },

    commenting: function () {
      return {
        isCommenting: this.$store.getters.commenting,
        comment:      ''
      }
    },
    isDetailView () {
      // return this.$store.getters.detailShowing
      return this.as === 'DETAIL'
    }
  },
  methods: {
    removeCoaster (coaster) {
      bus.$emit('remove-coaster', coaster)
    },
    makeDetail (coaster) {
      if (!this.coaster) return
      router.push({ name: 'detail', params: { id: this.coaster.key }})
    },
    closeDetailView () {
      bus.$emit('msg', {
        type: bus.CLOSE_DETAIL
      })
    },
    startCommenting () {
      this.$store.commit('START_COMMENTING')
    },
    // getWeekday (coaster) {
    //   if (this.coaster) {
    //     return moment(coaster.date).format('dddd, MMM Do')
    //   }
    // },
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
@import '../../../node_modules/bulma/bulma.sass';
// @import '../../libs/base.scss';
.coaster {
  @extend .box;
  margin: 2%;
  padding: 2%;
  border-radius: 6px;
  ul {
    max-width: 38em;
  }
}
div.type, div.type-label {
  display: inline-block;
  text-align: center;
}
div.type {
  max-width: 16%;
  img {
    width: 100%;
  }
}

.actions {
  text-align: right;
  button {
    min-width: 38%;
  }
  .in-contain {
    display: inline-block;
    button.pick-up {
      border-radius: 0px;
    }
  }
}

  li {
    background-color: rgb(67, 97, 154);
  }


</style>
