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

const db = firebase.database()
const coastersRef = db.ref('data/coasters').orderByChild('date').startAt('2016-01-02')


console.log(actions);
const store = new Vuex.Store({
  state: {
    count: 0,
    coasters: []
  },
  mutations: {
  	increment: state => state.count++,
    decrement: state => state.count--,
    GET_COASTERS (state, coasters) {
      console.log(coasters)
      state.count = coasters.length
      state.coasters = coasters
    }
  },
  actions,
  getters
})



export default store
