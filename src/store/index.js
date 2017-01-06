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
    historical: [],
    coasterFilters: {
      days: [],
      times: [],
      shiftTypes: []
    },
    modal: {
      show: false,
      notifications: []
    },
    commenting: false,
    daysOfTheWeek: ['S', 'M', 'T', 'W', 'R', 'F', 'S'],
    shiftTypes: ['Host', 'Bus', 'Barback', 'Serve', 'Bartend'],
    times: ['AM', 'PM']
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
    GET_HISTORICAL (state, coasters) {
      state.historical = coasters
    },
    GET_COASTER (state, coasterId) {
      state.detailCoaster.id = coasterId
    },
    ADD_FILTER (state, {filterType, filter}) {
      state.coasterFilters[filterType] = [...state.coasterFilters[filterType], filter]
    },
    REMOVE_FILTER (state, {filterType, index}) {
      state.coasterFilters[filterType] = [
        ...state.coasterFilters[filterType].slice(0, index),
        ...state.coasterFilters[filterType].slice(index + 1),
      ]
    },
    CLEAR_FILTERS (state) {
      state.coasterFilters = {
        days: [],
        times: [],
        shiftTypes: []
      }
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
