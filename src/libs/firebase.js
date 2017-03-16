import firebase from 'firebase'
import { production, development } from '../fbConfig'
/**
 *
 * Exposes full firebase library
 *
 */
console.log(process.env.NODE_ENV);

let environment = process.env.NODE_ENV === 'production' ? production : development

firebase.initializeApp(environment)
 const facebookAuthProvider = new firebase.auth.FacebookAuthProvider()

export { firebase, facebookAuthProvider }
