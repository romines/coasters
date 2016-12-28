import { firebase, moment } from '../libs'

const db = firebase.database()
const coastersRef = db.ref('data/coasters').orderByChild('date').startAt('2016-01-02')






const increment = ({ commit }) => {
  setTimeout(() => {
    commit('increment')
  }, 684)
}

const getCoasters = ({ commit, state }) => {
  //
  // initialize coasters
  //

  let today = moment().format('YYYY-MM-DD')
  switch (state.route.path) {
    case '/':
      console.log('looks like home')
      break;
    case '/history':
      console.log('looks like history')
      break;
    default:
      console.log('unmatched route')
  }

  coastersRef.on('value', (snap) => {
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

// const changeList = ({ commit }, )

export { increment, getCoasters }
