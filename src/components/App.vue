<template>
  <div id="app-container">

    <modal :myProps="modalProps"></modal>

    <navigation></navigation>

    <section class="section">
      <router-view :coasters="coasters" :myProps="routerViewProps"></router-view>
    </section>

  </div>
</template>

<script>

// everyone should probably have
//
import moment from 'moment'
import bus from '../bus'

// all components should probably have
//
import router from '../router'
import Navigation from './Navigation.vue'
import Modal from './widgets/Modal.vue'

import { firebase } from '../libs'
import mixins from '../mixins'

// not sure
//
import auth from '../auth'

import { fbRefFromChild } from '../helpers'




// components might establish their own ref
// this is essentially read only
// any actions relating to data must go through bus/actions

const db = firebase.database()
const coastersRef = db.ref('data/coasters')



// anything that works out here can be moved to modules/helpers

// these are shift actions



function attachListeners(vm) {

  // TODO: We want to get event 'routing' out of App component while still updating
  // app state appropriately on global events. By passing in the viewmodel, this
  // can all be moved to a module! But it must have access to all the methods it
  // references



}

export default {

  components: {
    Navigation,
    Modal
  },
  created () {
    this.$store.dispatch('getCoasters')
    this.$store.dispatch('listenToFbAuthState')
  },
  data: function () {
    return {

      authState: {
        status: 'LOGGED_IN',
        user: null
      },
      navProps: {
        navState: {
          home: true,
          history: false,
          post: false,
        }
      }
    }
  },

  computed: {

    coasters () {
      return this.$store.state.coasters

    },

    routerViewProps () {
      return {
        authState: this.authState
      }
    },
    modalProps () {
      return this.$store.state.modal
    }
  },
  methods: {

    makeLocal () {
      this.list = 'offLine'
    },
    makeFirebase () {
      this.list = 'firebase'
    },
    increment () {
      this.$store.commit('increment')
    },
    decrement () {
    	this.$store.commit('decrement')
    },
    incrementAsync () {
      this.$store.dispatch('increment')
    }
  }
}
</script>
<!-- <style src="bulma/css/bulma.css"></style> -->

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Orbitron:700');
@import '../../node_modules/bulma/bulma.sass';
.coaster { @extend .box }
ul {
  list-style-type: none;
}

img.close {
  max-width: 1em;
  float: right;
}
</style>
