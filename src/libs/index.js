import { firebase, facebookAuthProvider } from './firebase'
import moment from 'moment'
import { encode, decode } from 'firebase-encode'

const db = firebase.database()

let cloud = {
	log : (data) => {
		let logsRef = db.ref('logs')
		var newLogRefKey = logsRef.push().key
		logsRef.update(data)
	}
}


export { firebase, moment, facebookAuthProvider, cloud, encode, decode }
