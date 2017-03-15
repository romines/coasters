import { firebase, moment, facebookAuthProvider } from '../libs'

const db = firebase.database()
const auth = firebase.auth()
const baseRef = db.ref('data')
const coastersRef = db.ref('data/coasters')


function addFilter({ commit }, filter) {
  commit('ADD_FILTER', filter)
}


function listenToFbAuthState({ commit, state }) {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      if (!user.displayName) {
        user.updateProfile({
          displayName: state.authState.tempUserData.displayName
        }).then(() => {
          commit('LOG_IN_USER', user)
        }, (error) => console.log(error))
      } else {
        commit('LOG_IN_USER', user)
      }
      // commit('CLOSE_MODAL')
    } else {
      commit('LOG_OUT_USER', user)
    }
  })
}

function signUpUser({ dispatch, commit, state }, user) {
  commit('SAVE_TEMP_USER', user)
  firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
  .then(function () {

    commit('SHOW_MODAL', {
      component:'ImageUpload',
      heading: 'Profile Picture',
      message: 'Add a photo so Lisa knows who you are . . .',
      onSuccess: state.modal.contents.onSuccess
    })
  })
  .catch(function(error) {
    commit('AUTH_ERROR', error.message)
  });

}

function updateUserPhotoURL({ commit }, photoURL) {

  let currentUser = firebase.auth().currentUser;
  currentUser.updateProfile({
    photoURL
  })
  .then(function () {
    commit('UPDATE_PHOTO_URL', photoURL)
  })
  .catch(function(error) {
    commit('AUTH_ERROR', error.message)
  });

}


function logInUser({ commit, state }, user) {

  auth.signInWithEmailAndPassword(user.email, user.password).then((user) => {
    if (state.modal.contents.onSuccess) state.modal.contents.onSuccess(user.uid)
  },
    (e) => {
      commit('AUTH_ERROR', getLoginError(e))
    }
  )
}

function logInWithFacebook({ commit }) {
  auth.signInWithPopup(facebookAuthProvider).then((result) => {
    commit('CLOSE_MODAL')
    if (state.modal.contents.onSuccess) state.modal.contents.onSuccess(user.uid)
    // // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    // var token = result.credential.accessToken;
    // // The signed-in user info.
    // var user = result.user;
    // // ...
  }).catch(e => commit('AUTH_ERROR', e.message));
}

function logOutUser({}) {
  console.log('logging out');
  firebase.auth().signOut()
}

function getCoasters ({ commit, state }) {
  console.log('Getting coasters . . .');
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

function newCoaster ({ commit, state }, coasterData) {
  if (!state.authState.user) {
    alert('Please login before posting shifts')
    return
  }

  let postedBy = {
    uid: state.authState.user.uid,
    displayName: state.authState.user.displayName,
    photoURL: state.authState.user.photoURL
  }
  const key = coastersRef.push().key;
  coasterData.posted = moment().format()

  // Write the coaster data simultaneously in the coaster list and the user's coaster list.
  let updates = {};
  updates['/coasters/' + key] = coasterData;
  updates['/user-coasters/' + postedBy.uid + '/posted/' + key] = coasterData;

  return baseRef.update(updates);
}


function cancelCoaster ({ commit, state }, key) {

  let uid = state.authState.user.uid
  let updates = {};
  updates['/coasters/' + key] = null
  updates['/user-coasters/' + uid + '/posted/' + key] = null
  return baseRef.update(updates);

}

function postComment ({ commit, state }, payload) {
  const coaster = payload.coaster
  console.log(coaster);
  const now = moment().format()
  const user = state.authState.user
  console.log(user);
  let newComment = {
    when: now,
    postedBy: {
      name: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL ? user.photoURL : null
    },
    text: payload.comment
  }

  const newCommentRef = coastersRef.child(coaster.key).child('coasterComments').push()
  const newCommentKey = newCommentRef.key
  let coasterComments = {...coaster.coasterComments}

  coasterComments[newCommentKey] = newComment

  let coasterData = {
    ...coaster,
    coasterComments
  }
  console.log(coasterData);
  let updates = {};
  updates['/coasters/' + coaster.key] = coasterData

  // TODO: abstract to a fanout method

  if (coaster.coasterHistory && coaster.coasterHistory.length > 0) {
    for (var [key, historyEntry] of Object.entries(coaster.coasterHistory)) {
      let coveringFor = historyEntry.coveringFor
      let pickedUpBy = historyEntry.pickedUpBy
      updates['/user-coasters/' + pickedUpBy.uid + '/picked-up/' + coaster.key] = coasterData
      updates['/user-coasters/' + coveringFor.uid + '/posted/' + coaster.key] = coasterData
    }
  }
  console.log(updates)

  baseRef.update(updates);

}

function pickUpCoaster ({ commit, state }, coaster) {
  const now = moment().format()
  const user = state.authState.user
  let newShiftTrade = {
    when: now,
    pickedUpBy: {
      name: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL ? user.photoURL : null
    },
    coveringFor: {
      name: coaster.postedBy.displayName,
      uid: coaster.postedBy.uid,
      photoURL: coaster.postedBy.photoURL ? coaster.postedBy.photoURL : null
    }
  }
  const newHistoryItemRef = coastersRef.child(coaster.key).child('coasterComments').push()
  const newHistoryItemKey = newHistoryItemRef.key

  let coasterHistory = {...coaster.coasterHistory}
  coasterHistory[newHistoryItemKey] = newShiftTrade

  let coasterData = {
    ...coaster,
    coasterHistory
  }

  let updates = {};
  updates['/coasters/' + coaster.key] = coasterData
  updates['/user-coasters/' + user.uid + '/picked-up/' + coaster.key] = coasterData
  updates['/user-coasters/' + coaster.postedBy.uid + '/posted/' + coaster.key] = coasterData
  commit('CLOSE_MODAL')
  return baseRef.update(updates);

}


/**
 *
 * utils
 *
 */

 function getLoginError(e) {
   switch (e.code) {
     case 'auth/user-not-found':
       return 'That email address is not recognized'
       break;
     case 'auth/invalid-email':
       return 'Please provide a valid email address'
       break;
     case 'auth/wrong-password':
       return 'That password is incorrect'
       break;
     default:
       return 'An error has occured'

   }
 }



export {

   listenToFbAuthState
  , signUpUser
  , updateUserPhotoURL
  , logInUser
  , logInWithFacebook
  , logOutUser
  , getCoasters
  , newCoaster
  , postComment
  , pickUpCoaster
  , cancelCoaster
  , addFilter  // this is synchronous...

}
