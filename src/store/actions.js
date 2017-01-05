import { firebase, moment, facebookAuthProvider } from '../libs'

const db = firebase.database()
const auth = firebase.auth()
const coastersRef = db.ref('data/coasters')


function getCoasters ({ commit, state }) {
  console.log('attempting to get coasters');
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

function signUpUser({ commit }, user) {
  const addDisplayName = ({displayName}) => {
    var user = auth.currentUser

    user.updateProfile({ displayName }).then(
      () => commit('LOG_IN_USER', user)
      , e => console.log(e.message))

  }

  auth.createUserWithEmailAndPassword(user.email, user.password).then(() => {

    logInUser({ commit }, user, addDisplayName)
  }, e => console.log(e.message))
}

function logInUser({ commit }, user, cb) {
  auth.signInWithEmailAndPassword(user.email, user.password).then(() => {
    cb(user)
    commit('CLOSE_MODAL')
  }, e => console.log(e.message))
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
  }).catch(e => console.log(e));
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
  coasterData.posted = firebase.database.ServerValue.TIMESTAMP
  let newCoasterRef = coastersRef.push()
  newCoasterRef.set(coasterData);
}


export {

    getCoasters
  , newCoaster
  , addFilter
  , listenToFbAuthState
  , signUpUser
  , logInUser
  , logInWithFacebook
  , logOutUser
  // , getCoaster

}
