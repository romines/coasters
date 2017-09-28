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
// why doesn't this work???
// import { Navigation, BottomNav, Modal } from './widgets'

import { firebase } from '../libs'
import mixins from '../mixins'


const db = firebase.database()
const coastersRef = db.ref('data/coasters')




export default {

  components: {
    Navigation,
    Modal,
    BottomNav
  },
  created () {
    this.$store.dispatch('listenToAuthState')
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

.safari-hack {
  display: none;
}
.safari .safari-hack {
  display: block;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 44px;
  overflow: hidden;
  background-color: #4679c7;
}
// keep stupid safari action and url bar around all the time, I guess
// html, body.safari {
//   height: 100% -44px;
//   overflow-y: scroll;
//   -webkit-overflow-scrolling: touch;
// }


</style>
