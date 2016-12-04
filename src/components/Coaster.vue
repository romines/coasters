<template lang="html">

  <div class="card is-fullwidth">
    <header class="card-header">
      <p class="card-header-title">
        Component
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
        <p class="title is-5">John Smith</p>
        <p class="subtitle is-6">@johnsmith</p>
      </div>
    </div>
      <div class="content">
        {{ coaster.comment }}</br>
        <small>{{ coaster.date }} - {{ coaster.time }}</small>
      </div>
    </div>
    <footer class="card-footer">
      <a class="card-footer-item">Save</a>
      <a class="card-footer-item">Edit</a>
      <a class="card-footer-item">Delete</a>
    </footer>
  </div>
  <!-- <li class="coaster">
    <div class="type">
      <img v-if="coaster.shiftType" :src="loadSvg(coaster.shiftType)" alt="" />
      <div class="type-label">
        {{ coaster.shiftType }}
      </div>
    </div>
    <img v-if="as==='DETAIL'" @click="closeDetailView()" class="close" :src="loadSvg('close')" alt="" />

    <div class="actions">
      <div class="in-contain">
        <my-button :onClick="makeDetail" :ocArgs="coaster"></my-button>
      </div>
    </div>
  </li> -->
</template>

<script>
import bus from '../bus'
import moment from 'moment'
import mixins from '../mixins'
import * as myButton from './shared/Button.vue'
export default {
  props: ['coaster','as'],
  mixins: [mixins],
  data () {
    return {}
  },
  computed: {
    weekday () {
      return moment(this.coaster.date).format('dddd');
    }
  },
  methods: {
    removeCoaster (coaster) {
      bus.$emit('remove-coaster', coaster)
    },
    makeDetail (coaster) {
      bus.$emit('msg', {
        type: bus.MAKE_DETAIL,
        payload: coaster
      })
    },
    closeDetailView () {
      bus.$emit('msg', {
        type: bus.CLOSE_DETAIL
      })
    }
  },
  components: {
    myButton
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.coaster {
  // border: 1px dashed white;
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
