import { firebase
  , moment
  , facebookAuthProvider
  , cloud
  , decode
 } from '../libs'

const db = firebase.database()
const auth = firebase.auth()
const baseRef = db.ref('data')
const coastersRef = db.ref('data/coasters')
const usersRef = db.ref('data/users')


export default {

  addFilter({ commit }, filter) {
    commit('ADD_FILTER', filter)
  }


  , listenToAuthState ({ commit, state, dispatch }) {


    firebase.auth().onAuthStateChanged(user => {

      const trimUser = ({uid, displayName, photoURL, email}) => {
        return {uid, displayName, photoURL, email}
      }

      if (user) {
        dispatch('watchPhotoURL', user.uid)
        dispatch('watchUserNotifications', user.uid)
        if (!user.displayName) {
          user.updateProfile({
            displayName: state.authState.tempUserData.displayName
          }).then(() => {

            commit('LOG_IN_USER', trimUser(user))
          }, (error) => console.log(error))
        } else {

          commit('LOG_IN_USER', trimUser(user))
        }
        if (user.photoURL) commit('CLOSE_MODAL')

      } else {
        commit('LOG_OUT_USER', user)
        commit('GET_USER_DATA', {posted: [], holding: []})
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
        message: 'Adding a photo makes people more likely to pick up your shifts',
        onSuccess: state.modal.contents.onSuccess
      })
    })
    .catch(function(error) {
      console.log(error);
      commit('AUTH_ERROR', error.message)
    });
  }

  , watchUserNotifications ({commit}, uid) {
    const userRef = baseRef.child(`users/${uid}/notifications`).on('value', (snap) => {
      if (!snap.val()) return
      // dispatch('updateUserPhotoURL', snap.val())
      let notifications = []
      snap.forEach((childSnap) => {
        let notification = childSnap.val()
        if (!notification.key) notification.key = childSnap.key
        notification.message = decode(notification.message)
        notifications.push(notification)
      })
      commit('GET_NOTIFICATIONS', notifications)
    })
  }

  , updateUserPhotoURL ({ commit }, photoURL) {
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
      listRef.on('value', (snap) => {
        let coasters = snap.val()
        if (!coasters) {
          resolve()
          return
        }
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

  , getPromisedUserData ({ commit, state }, uid) {

    return new Promise((resolve, reject) => {
      let userRef = usersRef.child(uid)
      userRef.on('value', (snap) => {
        let userData = snap.val()
        if (!userData) {
          resolve()
          return
        }
        commit('GET_USER_DATA', userData)
        resolve()
      })

    })

    // return new Promise((resolve, reject) => {
    //
    //   userRef.on('value', (snap) => {
    //     let userData = snap.val()
    //     commit('GET_USER_DATA', userData)
    //     resolve()
    //   })
    //
    // })

  }



  , newCoaster ({ commit, state }, coasterData) {
    if (!state.authState.user) {
      alert('Please login before posting shifts')
      return
    }

    coasterData.postedBy = {
      uid: state.authState.user.uid,
      name: state.authState.user.displayName,
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
    updates[`/coasters/${key}/available`] = false
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
      pickedUp: now,
      pickedUpBy,
      coveringFor: {
        name: coaster.heldBy.name,
        uid: coaster.heldBy.uid,
        photoURL: coaster.heldBy.photoURL ? coaster.postedBy.photoURL : null
      },
      posted: coaster.posted
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

    updates['/coasters/' + coaster.key] = coasterData
    updates[`/users/${user.uid}/holding/${coaster.key}`] = coasterData
    updates[`/users/${coaster.heldBy.uid}/holding/${coaster.key}`] = null
    commit('CLOSE_MODAL')
    return baseRef.update(updates);
  }

  , repostCoaster ({ commit, state }, coaster) {
    const now = moment().format()
    const user = state.authState.user
    const postedBy = {
      name: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL ? user.photoURL : null

    }
    let coasterData       = {...coaster}
    coasterData.postedBy  = postedBy
    coasterData.posted    = now
    coasterData.available = true

    let updates = {}
    updates['/coasters/' + coaster.key] = coasterData
    updates[`/users/${user.uid}/posted/${coaster.key}`] = coasterData
    return baseRef.update(updates);

  }

  , dismissNotification ({ state }, notieKey) {
    let updates = {}
    const userKey = state.authState.user.uid
    updates[`/users/${userKey}/notifications/${notieKey}/status`] = 'read'
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
//    listenToAuthState
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
