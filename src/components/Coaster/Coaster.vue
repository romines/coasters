<template lang="html">
  <div v-if="coaster" @click="makeDetail()" class="coaster">

    <div class="card is-fullwidth">

      <header class="card-header">
        <p class="card-header-title">
          <img class="shift-icon" v-bind:src="loadSvg(coaster.shiftType)" alt="">
          <span class="date">{{mediumDateString}}</span>
          <span class="time"><i class="fa" :class="timeIcon"></i></span>
        </p>

        <a v-if="isDetailView" @click="closeDetailView" class="card-header-icon">
          <i class="fa fa-close"></i>
        </a>
      </header>

      <div class="card-content">
        <div class="media">
          <div class="media-left">
            <figure class="posted-by-user">
              <img v-if="coaster.postedBy.photoURL" :src="coaster.postedBy.photoURL" alt="">
              <span v-if="!coaster.postedBy.photoURL" class="icon is-large">
                <i class="fa fa-user"></i>
              </span>
            </figure>
          </div>

          <div class="media-content">
            <ul>
              <li>{{longDateString}}</li>
              <li><strong>{{coaster.time + ' ' + coaster.shiftType}}</strong></li>
              <li>for <strong>{{coaster.postedBy.displayName}}</strong></li>
              <li><small>{{datePosted}}</small></li>
            </ul>
            <span class="desktop-comments">{{ coaster.comment }}</span>
          </div>
        </div>

        <div class="content">

          <span class="mobile-comments">{{ coaster.comment }}</span>
          <div v-if="isDetailView" class="details">

            <action-buttons></action-buttons>
            <textarea v-if="isCommenting" class="textarea"></textarea>
          </div>

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

    longDateString () {
      return moment(this.coaster.date).format('dddd, MMM Do')
    },

    mediumDateString () {
      return moment(this.coaster.date).format('ddd, MMM Do')
    },

    datePosted () {
      if (!this.coaster.posted) return
      return moment(this.coaster.posted).fromNow()
    },

    timeIcon () {
      return (this.coaster.time === 'PM') ? 'fa-moon-o' : 'fa-sun-o'
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
@import '../../../node_modules/bulma/sass/utilities/mixins.sass';

.coaster {
  &:hover {
    cursor: pointer;
  }
  .card-header {
    .card-header-title {
      align-items: center;
      justify-content: space-between;
    }
    img.shift-icon {
      width: 8vw;
      max-height: 50px;
    }
    @include tablet {
      .date {
        font-size: 1.8em;
      }
      .time {
        line-height: 1em;
        .fa {
          font-size: 2.8em;
        }
      }
    }
  }
  .media-left {
    text-align: center;
    .fa-user {
      vertical-align: middle;
      line-height: inherit;
    }
    .posted-by-user {
      img {
        width: 74px;
        height: 74px;
        object-fit: cover;
      }
      .icon {
        width: 74px;
        height: 74px;
        line-height: 74px;
        vertical-align: bottom;
        border: 1px solid grey;
        border-radius: 3px;
      }
      @include tablet {
        img {
          width: 100px;
          height: 100px;
        }
        .icon {
          width: 100px;
        }

      }
    }
  }
  .desktop-comments {
    display: none;
    @include desktop {
      display: inline;
    };
  }
  .mobile-comments {
    display: inline;
    @include desktop {
      display: none;
    };
  }


}


</style>
