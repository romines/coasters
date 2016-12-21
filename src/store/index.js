import Vue from 'vue'
import Vuex from 'vuex'
import { firebase, moment } from '../libs'

Vue.use(Vuex)

const db = firebase.database()
const coastersRef = db.ref('data/coasters')

const store = new Vuex.Store({
  state: {
    count: 0,
    coasters: [
      {
        date: moment().format('YYYY-MM-DD'),
        time: 'AM',
        shiftType: 'Bus',
        comment: 'Super awesome coaster from the base store',
        pickedUp: false
      }
    ]
  },
  mutations: {
  	increment: state => state.count++,
    decrement: state => state.count--,
    updateCoasters (state, data) {
      console.log(data)
      state.count = data.length
      state.coasters = data
    }
  },
  actions: {
    increment ({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1200)
    }
  }
})

// read from firebase, mutate coasters list
coastersRef.on('value', (snap) => {
  let coasters = []
  let snapLength = snap.length
  snap.forEach((childSnap) => {
    let coaster = childSnap.val()
    coaster.key = childSnap.key
    coasters.push(coaster)
  })
  store.commit('updateCoasters', coasters)
})

export default store
