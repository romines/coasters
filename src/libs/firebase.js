import firebase from 'firebase'
import { production, development, staging } from '../fbConfig'
/**
 *
 * Exposes full firebase library
 *
 */
let environment = process.env.FIREBASE ? process.env.FIREBASE : 'production'
console.log(`Firebase connection established to ${environment} . . .`);
const fbConfig = {
  production, development, staging
}

firebase.initializeApp(fbConfig[environment])
 const facebookAuthProvider = new firebase.auth.FacebookAuthProvider()

export { firebase, facebookAuthProvider }
