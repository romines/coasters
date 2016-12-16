import firebase from 'firebase'
import config from '../fbConfig'

/**
 *
 * Exposes full firebase library
 *
 */

export default firebase.initializeApp(config)
