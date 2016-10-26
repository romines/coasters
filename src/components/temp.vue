<template lang="html">
  <li class="coaster">
    <div class="type">
      <img :src="loadSvg(coaster.shiftType)" alt="" />
      <div class="type-label">
        {{ coaster.shiftType }}
      </div>
    </div>
    <ul>
      <li>{{ coaster.date }}</li>
      <li>{{ coaster.time }}</li>
      <li>{{ coaster.comment }}</li>
    </ul>
    <div class="actions">
      <div class="in-contain">
        <button class="pick-up" @click="removeCoaster(coaster['.key'])">Pick Up</button>
        <!-- <button @click="removeCoaster(coaster['.key'])">Pick Up</button> -->
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: ['coaster'],
  data () {
    return {}
  },
  computed: {
    image: function () {
        return '../assets/Serve.svg';
    }
  },
  ready () {
    console.log('coaster', this.coaster);
  },
  attached () {},
  methods: {
    loadSvg (imgName) {
      return require('../assets/' + imgName + '.svg')
    },
    removeCoaster (key) {
      this.$emit('remove', [event.target, key, 'foo', {bar: 'baz'}])
      // this.$firebaseRefs.coasters.child(key).remove()
    },
  },
  components: {}
}
</script>

<style lang="scss">
.coaster {
  border: 1px dashed white;
  padding: 2%;
}
ul {
  display: inline-block;
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
  .in-contain {
    display: inline-block;
    button.pick-up {
      border-radius: 0px;
    }
  }
}
  ul {
    list-style-type: none;
    li {
      background-color: rgb(67, 97, 154);
    }
  }


</style>
