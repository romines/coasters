<template>
  <div id="app-container">
  <main>

    <modal/>

    <navigation/>

    <section class="section">
      <router-view/>
    </section>

    <bottom-nav/>

  </main>

  </div>
</template>

<script>


// all components should probably have
//
import Navigation from './widgets/Navigation.vue'
import BottomNav from './widgets/BottomNav.vue'
import Modal from './widgets/Modal.vue'
// why doesn't this work???
// import { Navigation, BottomNav, Modal } from './widgets'



export default {

  components: {
    Navigation,
    Modal,
    BottomNav
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
  created () {
    this.$store.dispatch('listenToAuthState')
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

span {
  user-select: none;
}

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
