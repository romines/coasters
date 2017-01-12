<template>
  <div id="app-container">
  <main>

    <modal></modal>

    <navigation></navigation>

    <section class="section">
      <router-view></router-view>
    </section>

    <bottom-nav></bottom-nav>

  </main>

  </div>
</template>

<script>

// everyone should probably have
//
import moment from 'moment'

// all components should probably have
//
import router from '../router'
import Navigation from './widgets/Navigation.vue'
import BottomNav from './widgets/BottomNav.vue'
import Modal from './widgets/Modal.vue'

import { firebase } from '../libs'
import mixins from '../mixins'


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
    Modal,
    BottomNav
  },
  created () {
    this.$store.dispatch('listenToFbAuthState')
  },
  data: function () {
    return {

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
    }
  },
  methods: {

  }
}
</script>
<!-- <style src="bulma/css/bulma.css"></style> -->

<style lang="scss">
@import '../../node_modules/bulma/sass/utilities/mixins.sass';
@import '../../node_modules/bulma/bulma.sass';

.coaster { @extend .box }
.container { max-width: 1080px;}

main {
  @include mobile {
    padding-bottom: 11vh;
  };
}
ul {
  list-style-type: none;
}

</style>
