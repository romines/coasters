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
const trimUser = ({uid, photoURL, email}) => {
  return {uid, photoURL, email}
}

export default {

  addFilter({ commit }, filter) {
    commit('ADD_FILTER', filter)
  }

  , listenToAuthState ({ commit, state, dispatch }) {


    firebase.auth().onAuthStateChanged(firebaseUser => {
      console.log('listenToAuthState');

      if (firebaseUser) {
        dispatch('watchPhotoURL', firebaseUser.uid)
        dispatch('watchUserNotifications', firebaseUser.uid)
        dispatch('setAdminStatus', firebaseUser)
        dispatch('getUserData', firebaseUser.uid)
          .then((userFromDatabase) => {
            let promised = []
            if (!firebaseUser.displayName) {
              promised.push(firebaseUser.updateProfile({displayName: userFromDatabase.displayName}))
            }

            if (!userFromDatabase.photoURL && firebaseUser.photoURL) {
              let updates = {}
              updates[`/users/${firebaseUser.uid}/photoURL`] = firebaseUser.photoURL
              promised.push(baseRef.update(updates))
            }

            return Promise.all(promised)

        })
        .then(() => {
          commit('LOG_IN_USER', trimUser(firebaseUser))
          if (firebaseUser.photoURL) commit('CLOSE_MODAL')
        }, (e) => {
          console.log(e)
          commit('AUTH_ERROR', e.message)

        })

      } else {
        // this was a log out event
        commit('LOG_OUT_USER')
        commit('GET_USER_DATA', {posted: {}, holding: {}})
        commit('GET_NOTIFICATIONS', [])
        commit('SET_ADMIN', false)
      }
    })
  }

  , signUpUser({ dispatch, commit, state }, newUserData) {

    const userDataToDb = (user) => {
      let updates = {}
      let authenticatedUser = trimUser(user)
      let mergedUser = { ...authenticatedUser, displayName: newUserData.displayName }
      updates[`/users/${mergedUser.uid}`] = mergedUser
      return baseRef.update(updates)
    }

    firebase.auth().createUserWithEmailAndPassword(newUserData.email, newUserData.password)
      .then((user) => {
        userDataToDb(user)
        commit('SHOW_MODAL', {
          component: 'ImageUpload',
          heading: 'One More Thing...',
          message: 'Adding a photo makes people more likely to pick up your shifts',
          onSuccess: state.modal.contents.onSuccess
        })


      }) // , (e) => {console.log(e)})
      .catch(function (error) {
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

  , setAdminStatus ({commit}, user) {
    if ([
      'faraday@snakeriverbrewing.com'
      ,'melissa@snakeriverbrewing.com'
      ,'christine@snakeriverbrewing.com'
      ,'lisa@snakeriverbrewing.com'
      ,'thom.penn@yahoo.com'
      ,'050803@email.com'              // DEV: lenny
    ].includes(user.email)) {
      console.log('this is an admin user')
      commit('SET_ADMIN', true)
    }
  }

  , updateUserPhotoURL ({ commit }, photoURL) {
    let currentUser = firebase.auth().currentUser;
    if (!currentUser) return console.log('no fb user to update photo for')
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

  , logInWithFacebook ({ commit, state, dispatch }) {
    auth.signInWithPopup(facebookAuthProvider).then((result) => {
      dispatch('getUserData', result.user.uid)
        .then((userFromDatabase) => {

          let updates = ['displayName', 'photoURL', 'email', 'uid'].reduce((updates, prop) => {
            if (result.user[prop] && !userFromDatabase[prop]) {
              updates[`/users/${result.user.uid}/${prop}`] = result.user[prop]
            }
            return updates
          }, {})


         return baseRef.update(updates)

      }).then(() => {

        commit('CLOSE_MODAL')
        if (state.modal.contents.onSuccess) state.modal.contents.onSuccess(result.user.uid)

      })

    }).catch((e) => {
      console.log(e, e.message);
      commit('AUTH_ERROR', e.message)}
    )
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

    const beginning = options ? options.beginning : defaults.beginning
    let listRef = coastersRef.orderByChild('date').startAt(beginning)

    return new Promise((resolve, reject) => {

      if (state.coasters.length && !options) {
        // console.log('Guess we\'re good with the coasters we\'ve got . . .');
        return resolve()
      }

      listRef.on('value', (snap) => {
        console.log('coasters value event ! ! ! ');
        let coasters = snap.val()
        if (!coasters) return resolve()

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

  , getUserData ({ commit, state }, uid) {
    let userRef = usersRef.child(uid)
    return userRef.on('value', (snap) => {
      let userData = snap.val()
      if (userData) commit('GET_USER_DATA', userData)
    })
  }

  , getUserPostedAndHoldingShifts ({commit, state}, uid) {
    if (!uid) debugger
    let currentUser = firebase.auth().currentUser
    if (!currentUser) {
      return new Promise ((resolve, reject) => {
        return reject('No current firebase user')
      })
    } else {
      return new Promise ((resolve, reject) => {
        let userRef = usersRef.child(uid)
        userRef.on('value', (snap) => {
          let userData = snap.val()
          if (!userData) {
            console.log('hit ref and no data . . .');
            return resolve({})
          }
          commit('GET_USER_DATA', userData)
          resolve(userData)
        })
      })

    }
  }

//   , getPromisedUserData ({ commit, state }, uid) {
// console.log('getPromisedUserData');

//     return new Promise((resolve, reject) => {
//       if (!firebase.auth().currentUser) return resolve(null)
//       let firebaseUser = firebase.auth().currentUser


//     })
//   }

  , getPromisedUsers ({ commit, state }) {
    console.log('getting all users . . . ');

    return new Promise((resolve, reject) => {
      let usersRef = baseRef.child('users')
      usersRef.on('value', (snap) => {
        let users = snap.val()
        let mappedUsers = Object.keys(users).map((key) => {
          let user = users[key]
          user.uid = key
          return user
        })

        commit('GET_ALL_USERS', mappedUsers)
        resolve()
      })

    })
  }

  , getPromisedDetailCoaster ({ commit, state }, key) {

    return new Promise((resolve, reject) => {

      let coasterRef = coastersRef.child(key)
      coasterRef.on('value', (snap) => {
        let coaster = snap.val()
        coaster.key = key
        commit('GET_DETAIL_COASTER', coaster)
        resolve()
      })

    })

  }



  , newCoaster ({ commit, state }, coasterData) {
    if (!state.authState.user) {
      alert('Please login before posting shifts')
      return
    }

    const user = (coasterData.postedAsUser && Object.keys(coasterData.postedAsUser).length) ? coasterData.postedAsUser : state.userData
    // .postedBy holds original poster data
    coasterData.postedBy = {
      uid: user.uid,
      name: user.displayName,
      photoURL: user.photoURL ? user.photoURL : ''
    }

    // .heldBy is kept up to date through trades
    coasterData.heldBy    = {...coasterData.postedBy}
    const key             = coastersRef.push().key
    coasterData.posted    = moment().format()
    coasterData.key       = key
    coasterData.available = true

    // Write the coaster data simultaneously in the coaster list and the user's coaster list.
    let updates                 = {};
    updates['/coasters/' + key] = coasterData;
    updates['/users/' + coasterData.postedBy.uid + '/posted/' + key] = coasterData;
    return baseRef.update(updates)

  }


  , cancelCoaster ({ commit, state }, coaster) {
    if (!coaster.available) return
    let updates = {}
    let coasterData = {...coaster}
    const user = state.userData

    if (!coaster.history) {
      //
      // This coaster has no history, just blow it away
      //
      console.log('This coaster has no history, just blow it away . . .');

      coasterData.inactive = true
      updates[`/users/${user.uid}/posted/${coaster.key}`] = null

    } else {
      //
      // This is a cancelled REPOST. Identify the relevant previous post
      // (the last history item before the REPOST). Reset the .posted (date)
      // to last uncancelled POST, reset postedBy to previous poster
      //
      const historyKeys = Object.keys(coaster.history).sort()
      const getPreviousPostedData = (index) => {
        if (index >= 0) {
          // console.log(coaster.history[index]);
          if (coaster.history[historyKeys[index]].type === 'REPOST') {
            return coaster.history[historyKeys[index-1]]
          } else {
            return getPreviousPostedData(index - 1);
          }
        } else {
          console.log('No REPOST found');
          return null;
        }
      }
      // Work backwards through history to find
      if (getPreviousPostedData(historyKeys.length-1)) {
        const previousPost = getPreviousPostedData(historyKeys.length-1)
        coasterData.posted = previousPost.posted
        coasterData.postedBy = previousPost.coveringFor
      }

      const newHistoryItemRef = coastersRef.child(coaster.key).child('history').push()
      const newHistoryItemKey = newHistoryItemRef.key
      const now = moment().format()
      const committedBy = {
        name: user.displayName,
        uid: user.uid,
        photoURL: user.photoURL ? user.photoURL : null
      }
      let coasterHistory = {...coaster.history}
      coasterHistory[newHistoryItemKey] = {
        type: 'CANCEL',
        committedBy,
        posted: now
      }
      coasterData.available = false
      coasterData.history   = {...coasterHistory}
    }

    updates['/coasters/' + coaster.key] = coasterData
    return baseRef.update(updates);

  }

  , adminRemove ({ commit, state }, key) {

    let updates = {};
    updates[`/coasters/${key}/inactive`] = true
    return baseRef.update(updates);

  }

  , postComment ({ commit, state }, payload) {

    const coaster = payload.coaster
    const now = moment().format()
    const user = state.userData
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

  , pickUpCoaster ({ commit, state }, options) {

    const now = moment().format()
    const user = options.user ? options.user : state.userData
    const coaster = options.coaster
    const newHistoryItemRef = coastersRef.child(coaster.key).child('history').push()
    const newHistoryItemKey = newHistoryItemRef.key

    let pickedUpBy = {
      name: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL ? user.photoURL : null
    }
    let newShiftTrade = {
      type: 'TRADE',
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
      available: false,
      reposted: false
    }

    let updates = {}

    updates['/coasters/' + coaster.key] = coasterData
    updates[`/users/${user.uid}/holding/${coaster.key}`] = coasterData
    updates[`/users/${coaster.heldBy.uid}/holding/${coaster.key}`] = null
    commit('CLOSE_MODAL')
    return baseRef.update(updates);

  }

  , repostCoaster ({ commit, state }, coaster) {
    const newHistoryItemRef = coastersRef.child(coaster.key).child('history').push()
    const newHistoryItemKey = newHistoryItemRef.key
    const now = moment().format()
    const user = state.userData
    const committedBy = {
      name: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL ? user.photoURL : null
    }
    let coasterHistory = {...coaster.history}
    coasterHistory[newHistoryItemKey] = {
      type: 'REPOST',
      committedBy,
      posted: now
    }

    let coasterData       = {...coaster}
    coasterData.postedBy  = committedBy
    coasterData.posted    = now
    coasterData.available = true
    coasterData.history   = {...coasterHistory}

    let updates = {}
    updates['/coasters/' + coaster.key] = coasterData
    updates[`/users/${user.uid}/posted/${coaster.key}`] = coasterData
    return baseRef.update(updates);

  }

  , flagCoaster ({ state }, coaster) {
    let updates = {};
    updates[`/coasters/${coaster.key}/flagged`] = coaster.flagged
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
       return 'An error has occurred'

   }
 }