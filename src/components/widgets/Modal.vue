<template lang="html">
  <div class="modal-mask" @click="close" v-show="show" transition="modal">
    <div class="modal-container" @click.stop>

      <component :is='modalComponent' :contents="contents">
        <h2 v-if="contents.heading" slot="title" class="headline">{{ contents.heading }}</h2>
        <p v-if="contents.message" slot="message" >{{ contents.message }}</p>
      </component>

    </div>
  </div>
</template>

<script>
import Login from '../Login.vue'
import ForgotPassword from './ForgotPassword.vue'
import Confirmation from './Confirmation.vue'
import ImageUpload from './ImageUpload.vue'
import PickUpAs from '../Coaster/PickUpAs.vue'

export default {
  data () {
    return {
    }
  },
  components: {
    Login,
    ForgotPassword,
    Confirmation,
    ImageUpload,
    PickUpAs
  },
  computed: {
    show () {
      return this.$store.state.modal.show
    },
    contents () {
      return this.$store.state.modal.contents
    },
    modalComponent () {
      return this.contents.component
    }
  },

  methods: {
    close () {
      this.$store.commit('CLOSE_MODAL')
    }
  }
}
</script>

<style lang="css">

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  transition: opacity .3s ease;
}

.modal-container {
  width: 300px;
  margin: 40px auto 0;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  /*transition: all .3s ease;*/
  font-family: Helvetica, Arial, sans-serif;
}

.headline {
  margin-top: 0;
  font-size: 1.8em;
}

.modal-body {
  margin: 20px 0;
}

.text-right {
  text-align: right;
}

.form-label {
  display: block;
  margin-bottom: 1em;
}

.form-label > .form-control {
  margin-top: 0.5em;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.5em 1em;
  line-height: 1.5;
  border: 1px solid #ddd;
}

.modal-enter, .modal-leave {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
