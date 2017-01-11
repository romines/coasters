import { firebase, moment, facebookAuthProvider } from '../libs'

const db = firebase.database()
const auth = firebase.auth()
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
  let testVar = 'myAwesomeTestVar'
  // const addDisplayName = ({displayName}) => {
  //   const user = auth.currentUser
  //
  //   user.updateProfile({ displayName }).then(
  //     () => commit('LOG_IN_USER', user)
  //     , e => {
  //       console.log(e.message)
  //       Promise.reject(e)
  //     }
  //   )
  //
  // }
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
      // commit('AUTH_ERROR', error.message)
      return Promise.reject(error)
    })
  console.log('now do something else');
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

function cancelCoaster ({ commit, state }, key) {
  if (key) {
    console.log('attempting to delete coaster: ', key);
    coastersRef.child(key).remove()
  }
}


export {

    getCoasters
  , getHistorical
  , newCoaster
  , cancelCoaster
  , addFilter
  , listenToFbAuthState
  , signUpUser
  , logInUser
  , logInWithFacebook
  , logOutUser
  // , getCoaster

}
