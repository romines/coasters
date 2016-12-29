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
    console.log(state.route);
    let coasters = []
    snap.forEach((childSnap) => {
      let coaster = childSnap.val()
      coaster.key = childSnap.key
      coasters.push(coaster)
    })

    commit('GET_COASTERS', coasters)

  })

}

function newCoaster ({ commit }, coasterData) {
  let newCoasterRef = coastersRef.push()
  newCoasterRef.set(coasterData);
}


export {

    increment
  , getCoasters
  , newCoaster
  // , startCommenting

}
