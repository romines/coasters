import firebase from 'firebase'
import config from '../fbConfig'

/**
 *
 * Exposes full firebase library
 *
 */

firebase.initializeApp(config)
 const facebookAuthProvider = new firebase.auth.FacebookAuthProvider()

export { firebase, facebookAuthProvider }
