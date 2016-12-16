// import firebase from './firebase'
import { firebase } from './libs'

import bus from './bus'

const auth = firebase.auth()
auth.onAuthStateChanged(user => {
  bus.$emit('msg', {
    type: bus.AUTH_STATE_CHANGE,
    payload: {user}
  })
})

function handleLoginEvent(e) {

  let email = e.payload.email
  let password = e.payload.password

  let promise = auth.signInWithEmailAndPassword(email, password)
  promise.catch(e => console.log(e.message))

}

function handleLoginEvent(e) {

  let promise = auth.signInWithEmailAndPassword(e.payload.email, e.payload.password)
  promise.catch(e => console.log(e.message))

}

function handleCreateUserEvent(e) {

  let promise = auth.createUserWithEmailAndPassword(e.payload.email, e.payload.password)
  promise.catch(e => console.log(e.message))

}

function handleLogOutUserEvent() {

  firebase.auth().signOut()

}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log(user);
  } else {
    console.log('no one logged in');
  }
})

function helloFromAuth() {
  console.log('hello from auth.js');
}

// const exposes = {  }

export default {
  helloFromAuth,
  handleLoginEvent
};
