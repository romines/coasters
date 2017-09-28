<template lang="html">
  <div v-if="coaster" @click="makeDetail()" class="coaster card is-fullwidth" :class="{ flagged : coaster.flagged && this.$store.state.authState.isAdmin }">

      <slot name="cardHeader">

        <header class="card-header">
          <p class="card-header-title">
            <span class="time"><i class="fa" :class="timeIcon"></i></span>
            <img class="shift-icon" :src="coaster ? loadSvg(coaster.shiftType) : ''" alt="">
          </p>

          <a v-if="isDetailView" @click.stop="closeDetailView" class="card-header-icon">
            <i class="fa fa-close"></i>
          </a>
        </header>

      </slot>

      <slot name="notice">
        <div class="notices">
          <div v-for="statusMessage in statusMessages" :class="statusMessage.messageClass">
            {{statusMessage.text}}
          </div>
        </div>
        <!-- <div v-if="!!pickedUpBy(coaster)" class="success">
          PICKED UP BY: {{pickedUpBy(coaster)}}
        </div> -->
      </slot>

      <div class="card-content">

        <slot name="main">

          <div class="posted-by media">
            <div class="media-left">
              <figure class="user">
                <img v-if="coaster.heldBy.photoURL" :src="coaster.heldBy.photoURL" alt="">
                <span v-if="!coaster.heldBy.photoURL" class="icon is-large">
                  <i class="fa fa-user"></i>
                </span>
              </figure>
            </div>

            <div class="media-content">
              <ul>
                <li>{{longDateString}}</li>
                <li><strong>{{coaster.time + ' ' + coaster.shiftType}}</strong></li>
                <li v-show="!options.hideFor">for <strong>{{coaster.heldBy.name}}</strong></li>
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
      // filter history for PICK_UPs, take (user from) last one
      if (!this.coaster.history) return
      let history = this.coaster.history
      let trades = [];
      for(var item in history) {
          trades.push(history[item])
      }
      return trades[trades.length -1].pickedUpBy
    },
    statusMessages () {
      let list = [
        {
          text: 'RE-POSTED',
          messageClass: 'info',
          active: this.isRepost
        },
        // {
        //   text: 'AVAILABLE',
        //   messageClass: 'success available',
        //   active: this.coaster.history && this.coaster.available
        // },
        {
          text: 'ON YOU',
          messageClass: 'warn',
          active: this.onTheHookFor
        }
      ]

      return list.filter(status => status.active)

    },
    onTheHookFor () {
      // if (Object.keys(this.coaster.history).length < 2) return
      if (this.$store.state.authState.user) {
        return this.coaster.available && (this.$store.state.authState.user.uid === this.coaster.heldBy.uid)
      }
    },
    isRepost () {
      // DELTA: Object.keys(this.coaster.history).filter(key => this.coaster.history[key].type === 'POST').length > 1
      return this.coaster.history && this.coaster.available
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
  &.flagged {
    border: 2px solid #a02020;
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
  .notices {
    & > div {
      display: inline-block;
      padding: .2em .3em;
      margin: .2em 0 .2em .3em;
    }
    .warn {
      color: red;
      border: 1px solid red;
    }
    .success {
      color: green;
      border: 1px solid green;
    }
    .info {
      color: #3273dc;
      border: 1px solid #3273dc;
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
    font-size: 1.1em;
    padding-left: .8em;
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
