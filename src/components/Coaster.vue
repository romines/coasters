<template lang="html">
  <li class="coaster">
    <div class="type">
      <img v-if="coaster.shiftType" :src="loadSvg(coaster.shiftType)" alt="" />
      <div class="type-label">
        {{ coaster.shiftType }}
      </div>
    </div>
    <img v-if="as==='DETAIL'" @click="closeDetailView()" class="close" :src="loadSvg('close')" alt="" />
    <ul>
      <li>{{ coaster.date }}</li>
      <li>{{ coaster.time }}</li>
      <li>{{ coaster.comment }}</li>
      <li>picked up: {{ coaster.pickedUp }}</li>
    </ul>
    <div class="actions">
      <div class="in-contain">
        <!-- <button class="remove" @click="removeCoaster(coaster)">Remove</button>
        <button @click="makeDetail(coaster)">Pick Up</button> -->
        <my-button :onClick="makeDetail" :ocArgs="coaster"></my-button>
      </div>
    </div>
  </li>
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

<style lang="sass">
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
