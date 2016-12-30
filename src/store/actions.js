import { firebase, moment } from '../libs'

const db = firebase.database()
const coastersRef = db.ref('data/coasters')



const increment = ({ commit }) => {
  setTimeout(() => {
    commit('increment')
  }, 684)
}

const getCoasters = ({ commit, state }) => {

  let today = moment().format('YYYY-MM-DD')
  let listRef
  switch (state.route.path) {
    case '/history':
      listRef = coastersRef.orderByChild('date').startAt('2016-01-02')
      break;
    default:
      listRef = coastersRef.orderByChild('date').startAt(today)
  }

  listRef.on('value', (snap) => {
    let coasters = []
    snap.forEach((childSnap) => {
      let coaster = childSnap.val()
      coaster.key = childSnap.key
      coasters.push(coaster)
    })

    commit('GET_COASTERS', coasters)

  })

}

// const getCoaster = ({ commit, state }, key) => {
//   console.log('attempting to single out coaster from list...............', key);
//
//   commit('GET_COASTER', key)
//
//
// }

function newCoaster ({ commit }, coasterData) {
  let newCoasterRef = coastersRef.push()
  newCoasterRef.set(coasterData);
}


export {

    increment
  , getCoasters
  , newCoaster
  // , getCoaster

}
