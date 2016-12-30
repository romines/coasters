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

/*=============================================>>>>>
= Store Section =
===============================================>>>>>*/

Vue.use(Vuex)
const db = firebase.database()
const coastersRef = db.ref('data/coasters').orderByChild('date').startAt('2016-01-02')

/*= End of Store Section =*/
/*=============================================<<<<<*/

const store = new Vuex.Store({
  state: {
    count: 0,
    coasters: [],
    modal: {
      show: false
    },
    commenting: false
  },
  mutations: {
  	increment: state => state.count++,
    decrement: state => state.count--,
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
    START_COMMENTING: (state) => {
      state.commenting = true;
    }
  },
  actions,
  getters
})



export default store
