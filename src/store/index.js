/**
 *
 * *********** || Store
 *
 */

import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'


import { firebase, moment } from '../libs'


Vue.use(Vuex)


const store = new Vuex.Store({

  /*=============================================>>>>>
  = State =
  ===============================================>>>>>*/

  state: {
    authState: {
      user: null
    },
    count: 0,
    coasters: [],
    modal: {
      show: false,
      notifications: []
    },
    commenting: false
  },

  /*= End of State =*/
  /*=============================================<<<<<*/

  mutations: {
  	increment: state => state.count++,
    decrement: state => state.count--,
    LOG_IN_USER (state, user) {
      state.authState.user = user
    },
    LOG_OUT_USER (state) {
      state.authState.user = null
    },
    GET_COASTERS (state, coasters) {
      state.count = coasters.length
      state.coasters = coasters
    },
    GET_COASTER (state, coasterId) {
      console.log('inside a mutation......trying to GET_COASTER', coaster);
      state.detailCoaster.id = coasterId
    },
    SHOW_MODAL: (state, content) => {
      state.modal.show = true;
    },
    CLOSE_MODAL: (state) => {
      state.modal.show = false;
    },
    START_COMMENTING: (state) => {
      state.commenting = true;
    }
  },
  actions,
  getters
})



export default store
