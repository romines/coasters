<template lang="html">
  <div v-if="coaster" @click="makeDetail()" class="coaster card is-fullwidth">

      <slot name="cardHeader">

        <header class="card-header">
          <p class="card-header-title">
            <img class="shift-icon" :src="coaster ? loadSvg(coaster.shiftType) : ''" alt="">
            <span class="time"><i class="fa" :class="timeIcon"></i></span>
          </p>

          <a v-if="isDetailView" @click.stop="closeDetailView" class="card-header-icon">
            <i class="fa fa-close"></i>
          </a>
        </header>

      </slot>

      <slot name="notice"></slot>

      <div class="card-content">

        <slot name="main">

          <div class="posted-by media">
            <div class="media-left">
              <figure class="user">
                <img v-if="coaster.postedBy.photoURL" :src="coaster.postedBy.photoURL" alt="">
                <span v-if="!coaster.postedBy.photoURL" class="icon is-large">
                  <i class="fa fa-user"></i>
                </span>
              </figure>
            </div>

            <div class="media-content">
              <ul>
                <li v-show="!options.showPickedUp">{{longDateString}}</li>
                <li v-show="!options.showPickedUp"><strong>{{coaster.time + ' ' + coaster.shiftType}}</strong></li>
                <li>for <strong>{{coaster.postedBy.name}}</strong></li>
                <li><small>{{datePosted}}</small></li>
              </ul>
              <span class="desktop-comments">{{ coaster.comment }}</span>
            </div>
          </div>

        </slot>

        <div class="bottom">

          <slot name="comments"></slot>

          <slot name="primaryButtons"></slot>

          <slot name="newComment"></slot>

        </div>


      </div>

  </div>
</template>

<script>
import router from '../../router'
import moment from 'moment'
import mixins from '../../mixins'
import * as myButton from '../widgets/Button.vue'


export default {
  components: {
    myButton
  },
  mixins: [mixins],
  data () {
    return {
      localComment: '',
      isCommenting: false
    }
  },
  props: ['coaster', 'options'],

  computed: {
    pickingUpUser () {
      if (!this.coaster.history) return
      let history = this.coaster.history
      let trades = [];
      for(var item in history) {
          trades.push(history[item])
      }
      return trades[trades.length -1].pickedUpBy
    },
    datePosted () {
      // if (!this.coaster) return
      return moment(this.coaster.posted).fromNow()
    },

    timeIcon () {
      // if (!this.coaster) return
      return (this.coaster.time === 'PM') ? 'fa-moon-o' : 'fa-sun-o'
    },

    isDetailView () {
      return this.$store.state.route.name === 'detail'
    },

    longDateString () {
      // if (!this.coaster) return
      return moment(this.coaster.date).format('dddd, MMM Do')
    },

    mediumDateString () {
      // if (!this.coaster) return
      return moment(this.coaster.date).format('ddd, MMM Do')
    }


  },
  methods: {

    makeDetail (coaster) {
      if (!this.coaster || this.isDetailView) return
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
  padding: 0;
  &:hover {
    cursor: pointer;
  }
  .card-header {
    .card-header-title {
      align-items: center;
      justify-content: space-between;
    }
    img.shift-icon {
      width: 14vw;
      max-height: 40px;
    }
    .time i.fa {
      font-size: 2.3em;
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
    figure.user {
      img {
        width: 96px;
        height: 96px;
        object-fit: cover;
      }
      .icon {
        width: 96px;
        height: 96px;
        line-height: 96px;
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
  .media-content {
    font-size: 1.2em;
    padding-left: 1.2em;
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
