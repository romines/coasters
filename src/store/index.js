/**
 *
 * *********** || Store
 *
 */

import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'


import { firebase, moment } from '../libs'


Vue.use(Vuex)


const store = new Vuex.Store({

  /*=============================================>>>>>
  = State =
  ===============================================>>>>>*/

  state: {
    authState: {
      user: null,
      error: '',
      tempUserData: {},
      passwordResetError: ''
    },
    count: 0,
    coasters: [],
    userData: {
      posted: [],
      holding: [],
      notifications: []
    },
    notifications: [],
    historical: [],
    coasterFilters: {
      days: [],
      times: [],
      shiftTypes: []
    },
    modal: {
      show: false,
      contents: {
        component: 'Login',
        heading: '',
        message: '',
        buttons: [],
        onSuccess () {
          console.log('modal successfully modalized . . .')
        }
      }
    },
    commenting: false,
    daysOfTheWeek: ['S', 'M', 'T', 'W', 'R', 'F', 'S'],
    shiftTypes: ['Host', 'Bus', 'Barback', 'Serve', 'Bartend'],
    times: ['AM', 'PM']
  },

  /*= End of State =*/
  /*=============================================<<<<<*/

  mutations: {

    LOG_IN_USER (state, user) {
      state.authState.user = user
      state.authState.error = ''
    },
    LOG_OUT_USER (state) {
      state.authState.user = null
    },
    AUTH_ERROR (state, error) {
      console.log(error);
      state.authState.error = error
    },
    PASSWORD_RESET_ERROR (state, error) {
      console.log(error);
      state.authState.passwordResetError = error
    },
    UPDATE_USERNAME (state, username) {
      state.authState.user.displayName = username
    },
    UPDATE_PHOTO_URL (state, photoURL) {
      state.authState.user = {...state.authState.user, photoURL: photoURL}
    },
    SAVE_TEMP_USER (state, user) {
      state.authState.tempUserData = user
    },
    GET_COASTERS (state, coasters) {
      state.count = coasters.length
      state.coasters = coasters
    },
    GET_USER_DATA (state, userData) {
      state.userData = userData
    },
    GET_HISTORICAL (state, coasters) {
      state.historical = coasters
    },
    GET_DETAIL_COASTER (state, coaster) {
      state.detailCoaster = coaster
    },
    GET_NOTIFICATIONS (state, notifications) {
      state.notifications = notifications
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
    SHOW_MODAL: (state, contents) => {
      state.modal.show = true
      state.modal.contents = contents
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
