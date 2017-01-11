import { firebase, moment, facebookAuthProvider } from '../libs'

const db = firebase.database()
const auth = firebase.auth()
const baseRef = db.ref('data')
const coastersRef = db.ref('data/coasters')


function getCoasters ({ commit, state }) {
  console.log('attempting to get coasters');
  let today = moment().format('YYYY-MM-DD')
  let listRef = coastersRef.orderByChild('date').startAt(today)


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

function getHistorical ({ commit, state }) {
  console.log('attempting to get historical');
  let today = moment().format('YYYY-MM-DD')
  let listRef = coastersRef.orderByChild('date').endAt(today)

  listRef.on('value', (snap) => {
    let coasters = []
    snap.forEach((childSnap) => {
      let coaster = childSnap.val()
      coaster.key = childSnap.key
      coasters.push(coaster)
    })

    commit('GET_HISTORICAL', coasters)

  })

}

function addFilter({ commit }, filter) {
  commit('ADD_FILTER', filter)
}

function signUpUser({ dispatch, commit }, user) {

  auth.createUserWithEmailAndPassword(user.email, user.password)
    .then(() => {
      const firebaseUser = auth.currentUser
      return Promise.all([
        firebaseUser.updateProfile({displayName: user.displayName}),
        dispatch('logInUser', user)
      ])
    })
    .catch(error => {
      console.log(testVar);
      commit('AUTH_ERROR', error.message)
      return Promise.reject(error)
    })

}

function logInUser({ commit }, user) {
  console.log(user)
  auth.signInWithEmailAndPassword(user.email, user.password).then(() => {
    commit('CLOSE_MODAL')
  }, e => commit('AUTH_ERROR', e.message))
}

function logInWithFacebook({ commit }) {
  auth.signInWithPopup(facebookAuthProvider).then((result) => {
    console.log(result.user)
    commit('CLOSE_MODAL')
    // // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    // var token = result.credential.accessToken;
    // // The signed-in user info.
    // var user = result.user;
    // // ...
  }).catch(e => commit('AUTH_ERROR', e.message));
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

  let uid = state.authState.user.uid
  const key = coastersRef.push().key;

  // Write the coaster data simultaneously in the coaster list and the user's coaster list.
  let updates = {};
  updates['/coasters/' + key] = coasterData;
  updates['/user-coasters/' + uid + '/posted/' + key] = coasterData;

  return baseRef.update(updates);
}

function writeNewPost(uid, username, picture, title, body) {


}

function cancelCoaster ({ commit, state }, key) {

  let uid = state.authState.user.uid
  let updates = {};
  updates['/coasters/' + key] = null
  updates['/user-coasters/' + uid + '/posted/' + key] = null
  return baseRef.update(updates);

}

function pickUpCoaster ({ commit, state }, coaster) {
  const now = moment().format()
  const user = state.authState.user
  let history = {}

  history[now] = { name: user.displayName, uid: user.uid }
  let coasterData = Object.assign({}, coaster, {history})
  console.log(coasterData);
  let updates = {};
  updates['/coasters/' + coaster.key] = coasterData
  updates['/user-coasters/' + user.uid + '/picked-up/' + coaster.key] = coasterData
  updates['/user-coasters/' + coaster.postedBy.uid + '/posted/' + coaster.key] = coasterData
  return baseRef.update(updates);

}


export {

    getCoasters
  , getHistorical
  , newCoaster
  , pickUpCoaster
  , cancelCoaster
  , addFilter
  , listenToFbAuthState
  , signUpUser
  , logInUser
  , logInWithFacebook
  , logOutUser

}
