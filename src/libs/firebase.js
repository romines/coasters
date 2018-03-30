import firebase from 'firebase'
import { production, development, staging } from '../fbConfig'
/**
 *
 * Exposes full firebase library
 *
 */
console.log('process.env.FIREBASE: ' + process.env.FIREBASE);
let environment = process.env.FIREBASE === 'development' ? process.env.FIREBASE : 'production'
const fbConfig = {
  production, development, staging
}

firebase.initializeApp(fbConfig[environment])
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider()
console.log(`Firebase connection established to ${environment} . . .`);

export { firebase, facebookAuthProvider }
