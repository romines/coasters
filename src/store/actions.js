import { firebase, moment } from '../libs'

const db = firebase.database()
const auth = firebase.auth()
const coastersRef = db.ref('data/coasters')



const increment = ({ commit }) => {
  setTimeout(() => {
    commit('increment')
  }, 684)
}

function getCoasters ({ commit, state }) {

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

function addFilter({ commit }, filter) {
  commit('ADD_FILTER', filter)
}

function signUpUser({}, user) {
  const addDisplayName = ({displayName}) => {
    var user = auth.currentUser

    user.updateProfile({ displayName }).then(
      data => console.log(data)
      , e => console.log(e.message))

  }
  console.log(user.email, user.password)
  auth.createUserWithEmailAndPassword(user.email, user.password).then(() => {

    logInUser({}, user, addDisplayName)
  }, e => console.log(e.message))
}

function logInUser({ commit }, user, cb) {
  auth.signInWithEmailAndPassword(user.email, user.password).then(() => {
    cb(user)
    commit('CLOSE_MODAL')
  }, e => console.log(e.message))
}

function logOutUser({}) {
  firebase.auth().signOut()
}

function listenToFbAuthState({ commit }) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      commit('LOG_IN_USER', user)
    } else {
      console.log('no one logged in');
      commit('LOG_OUT_USER', user)
    }
  })
}

function newCoaster ({ commit, state }, coasterData) {
  if (!state.authState.user) {
    alert('Please login before posting shifts')
    return
  }
  // coasterData.postedBy
  let newCoasterRef = coastersRef.push()
  newCoasterRef.set(coasterData);
}


export {

    increment
  , getCoasters
  , newCoaster
  , addFilter
  , listenToFbAuthState
  , signUpUser
  , logInUser
  , logOutUser
  // , getCoaster

}
