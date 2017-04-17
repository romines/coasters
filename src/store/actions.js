import { firebase, moment, facebookAuthProvider, cloud } from '../libs'

const db = firebase.database()
const auth = firebase.auth()
const baseRef = db.ref('data')
const coastersRef = db.ref('data/coasters')


export default {

  addFilter({ commit }, filter) {
    commit('ADD_FILTER', filter)
  }


  , listenToFbAuthState ({ commit, state, dispatch }) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch('watchPhotoURL', user.uid)
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

  , signUpUser ({ dispatch, commit, state }, user) {
    commit('SAVE_TEMP_USER', user)
    firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
    .then(function () {

      commit('SHOW_MODAL', {
        component:'ImageUpload',
        heading: 'One More Thing...',
        message: 'Please add a profile picture',
        onSuccess: state.modal.contents.onSuccess
      })
    })
    .catch(function(error) {
      commit('AUTH_ERROR', error.message)
    });

  }

  , updateUserPhotoURL ({ commit }, photoURL) {
    console.log(arguments);
    let currentUser = firebase.auth().currentUser;
    currentUser.updateProfile({
      photoURL
    })
    .then(function () {
      console.log(commit);
      commit('UPDATE_PHOTO_URL', photoURL)
    })
    .catch(function(error) {
      commit('AUTH_ERROR', error.message)
    });

  }

  , watchPhotoURL ({dispatch}, uid) {
    const userRef = baseRef.child(`users/${uid}/photoURL`).on('value', (snap) => {
      if (!snap.val()) return
      dispatch('updateUserPhotoURL', snap.val())
    })
  }


  , logInUser ({ commit, state }, user) {

    auth.signInWithEmailAndPassword(user.email, user.password).then((user) => {
      if (state.modal.contents.onSuccess) state.modal.contents.onSuccess(user.uid)
    },
      (e) => {
        commit('AUTH_ERROR', getLoginError(e))
      }
    )
  }

  , logInWithFacebook ({ commit }) {
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

  , logOutUser ({}) {
    console.log('logging out');
    firebase.auth().signOut()
  }

  , sendPasswordReset ({ commit, state }, options) {
    auth.sendPasswordResetEmail(options.email).then(() => {
      options.onSuccess()
      // Email sent.
    }, (e) => {
      console.log(e);
      commit('PASSWORD_RESET_ERROR', getLoginError(e))
    });
  }

  , getCoasters ({ commit, state }) {
    console.log('Getting coasters . . .');
    let today = moment().format('YYYY-MM-DD')
    let listRef = coastersRef.orderByChild('date').startAt(today)


    listRef.on('value', (snap) => {
      let coasters = []
      snap.forEach((childSnap) => {
        let coaster = childSnap.val()
        if (!coaster.key) coaster.key = childSnap.key
        coasters.push(coaster)
      })

      commit('GET_COASTERS', coasters)

    })

  }

  , getPromisedCoasters ({ commit, state }, options) {
    const defaults = {
      beginning: moment().format('YYYY-MM-DD'),
      ending: null
    }
    options = options ? options : defaults

    let listRef = coastersRef.orderByChild('date').startAt(options.beginning)
    return new Promise((resolve, reject) => {
      // if (state.coasters) resolve()
      listRef.on('value', (snap) => {
        let coasters = snap.val()
        let preparedCoasters = Object.keys(coasters).map((key) => {
          let coaster = coasters[key]
          coaster.key = key
          return coaster
        })

        commit('GET_COASTERS', preparedCoasters)
        resolve()

      })
    })

  }



  , newCoaster ({ commit, state }, coasterData) {
    if (!state.authState.user) {
      alert('Please login before posting shifts')
      return
    }

    coasterData.postedBy = {
      uid: state.authState.user.uid,
      displayName: state.authState.user.displayName,
      photoURL: state.authState.user.photoURL
    }
    coasterData.heldBy    = {...coasterData.postedBy}
    const key             = coastersRef.push().key
    coasterData.posted    = moment().format()
    coasterData.key       = key
    coasterData.available = true

    // Write the coaster data simultaneously in the coaster list and the user's coaster list.
    let updates                 = {};
    updates['/coasters/' + key] = coasterData;
    updates['/users/' + coasterData.postedBy.uid + '/posted/' + key] = coasterData;

    return baseRef.update(updates);
  }


  , cancelCoaster ({ commit, state }, key) {

    let uid = state.authState.user.uid
    let updates = {};
    updates['/coasters/' + key] = null
    updates['/users/' + uid + '/posted/' + key] = null
    return baseRef.update(updates);

  }

  , postComment ({ commit, state }, payload) {

    const coaster = payload.coaster
    const now = moment().format()
    const user = state.authState.user
    let newComment = {
      when: now,
      postedBy: {
        name: user.displayName,
        uid: user.uid,
        photoURL: user.photoURL ? user.photoURL : null
      },
      text: payload.comment
    }

    const newCommentRef = coastersRef.child(coaster.key).child('comments').push()
    const newCommentKey = newCommentRef.key
    let coasterComments = {...coaster.comments}

    coasterComments[newCommentKey] = newComment

    let coasterData = {
      ...coaster,
      comments: {...coasterComments}
    }

    let updates = {};
    updates['/coasters/' + coaster.key] = coasterData
    updates[`/users/${user.uid}/coastersCommentedOn/${coaster.key}`] = true

    // fanout to history items happens in the cloud now

    // if (coaster.history && coaster.history.length > 0) {
    //   for (var [key, historyEntry] of Object.entries(coaster.history)) {
    //     let coveringFor = historyEntry.coveringFor
    //     let pickedUpBy = historyEntry.pickedUpBy
    //     updates['/users/' + pickedUpBy.uid + '/picked-up/' + coaster.key] = coasterData
    //     updates['/users/' + coveringFor.uid + '/posted/' + coaster.key] = coasterData
    //   }
    // }

    cloud.log(updates)

    baseRef.update(updates);

  }

  , pickUpCoaster ({ commit, state }, coaster) {

    const now = moment().format()
    const user = state.authState.user
    const newHistoryItemRef = coastersRef.child(coaster.key).child('history').push()
    const newHistoryItemKey = newHistoryItemRef.key

    let pickedUpBy = {
      name: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL ? user.photoURL : null
    }
    let newShiftTrade = {
      when: now,
      pickedUpBy,
      coveringFor: {
        name: coaster.heldBy.displayName,
        uid: coaster.heldBy.uid,
        photoURL: coaster.heldBy.photoURL ? coaster.postedBy.photoURL : null
      }
    }

    let coasterHistory = {...coaster.history}
    coasterHistory[newHistoryItemKey] = newShiftTrade

    let coasterData = {
      ...coaster,
      history: {...coasterHistory},
      heldBy: {...pickedUpBy},
      available: false
    }

    let updates = {}

    // if (Object.keys(coaster.history).length) {
    //   updates = Object.keys(coaster.history).reduce((updates, key) => {
    //     let historyItem = coaster.history[key]
    //     let postedBy = historyItem.postedBy
    //     updates[`/users/${postedBy.uid}/posted/coaster.key`] = coasterData
    //     return updates
    //   }, {})
    // }


    updates['/coasters/' + coaster.key] = coasterData
    updates[`/users/${user.uid}/holding/${coaster.key}`] = coasterData
    updates[`/users/${coaster.heldBy.uid}/holding/${coaster.key}`] = null
    commit('CLOSE_MODAL')
    return baseRef.update(updates);

  }
}

/**
 *
 * utils
 *
 */

 function getLoginError(e) {
   switch (e.code) {
     case 'auth/user-not-found':
       return 'We don\'t seem to have a user with that email address'
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



// export {
//
//    listenToFbAuthState
//   , signUpUser
//   , updateUserPhotoURL
//   , logInUser
//   , logInWithFacebook
//   , logOutUser
//   , getCoasters
//   , getPromisedCoasters
//   , newCoaster
//   , postComment
//   , pickUpCoaster
//   , cancelCoaster
//   , addFilter  // this is synchronous...
//
// }
