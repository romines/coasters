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
      user:               null,
      status:             '',
      error:              '',
      tempUserData:       {},
      passwordResetError: '',
      isAdmin:            false
    },
    count: 0,
    coasters: [],
    detailCoaster: {},
    userData: {
      posted:        [],
      holding:       [],
      notifications: []
    },
    usersList: [],
    notifications: [],
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
        props: {},
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
    SET_USER_LOGGED_IN_STATUS (state, newStatus) {
      state.authState.status = newStatus
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
    SET_ADMIN (state, isAdmin) {
      state.authState.isAdmin = isAdmin
    },
    GET_COASTERS (state, coasters) {
      state.count = coasters.length
      state.coasters = coasters
    },
    GET_USER_DATA (state, userData) {
      state.userData = userData
    },
    GET_ALL_USERS (state, users) {
      state.usersList = users
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
