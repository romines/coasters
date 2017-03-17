'use strict'
var admin = require("firebase-admin");
const uid = 'ccCDhUStE2huXKynKlEKQ78SJwZ2';

// Fetch the service account key JSON file contents
var serviceAccount = require("./fBServiceAccountKey_dev.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://srb-coasters-dev.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var root = db.ref("data");

let url = 'this is the new url'

function getImageUpdates (userCoasters, url) {
	return console.log(Object.keys(userCoasters.posted));
	let coastersPostedUpdates = Object.keys(userCoasters.posted).reduce((updates, key) => {

		updates[`/user-coasters/${uid}/posted/${key}/postedBy/photoURL`] = url;
		if (userCoasters[uid]['posted'][key]['coasterHistory']) {
			let coasterHistory = userCoasters[uid]['posted'][key]['coasterHistory'];
			for (historyItem in coasterHistory) {
				if (coasterHistory[historyItem].coveringFor.uid === uid) {
					updates[`/user-coasters/${uid}/posted/${key}/coasterHistory/${historyItem}/coveringFor/photoURL`] = url;
					updates[`/coasters/${key}/coasterHistory/${historyItem}/coveringFor/photoURL`] = url;
				}
				if (coasterHistory[historyItem].pickedUpBy.uid === uid) {
					updates[`/user-coasters/${uid}/posted/${key}/coasterHistory/${historyItem}/pickedUpBy/photoURL`] = url;
					updates[`/coasters/${key}/coasterHistory/${historyItem}/pickedUpBy/photoURL`] = url;
				}
			}
		}

		return updates;

	}, {});

	return Object.keys(userCoasters['picked-up']).reduce((updates, key) => {

		if (userCoasters[uid]['picked-up'][key]['coasterHistory']) {
			let coasterHistory = userCoasters[uid]['picked-up'][key]['coasterHistory'];
			for (historyItem in coasterHistory) {
				if (coasterHistory[historyItem].coveringFor.uid === uid) {
					updates[`/user-coasters/${uid}/posted/${key}/coasterHistory/${historyItem}/coveringFor/photoURL`] = url;
					updates[`/coasters/${key}/coasterHistory/${historyItem}/coveringFor/photoURL`] = url;
				}
				if (coasterHistory[historyItem].pickedUpBy.uid === uid) {
					updates[`/user-coasters/${uid}/posted/${key}/coasterHistory/${historyItem}/pickedUpBy/photoURL`] = url;
					updates[`/coasters/${key}/coasterHistory/${historyItem}/pickedUpBy/photoURL`] = url;
				}
			}
		}

		return updates;

	}, coastersPostedUpdates);

}

root.child(`/user-coasters/${uid}`).once('value', (userCoasters) => {
	let updates = getImageUpdates(userCoasters.val());
	console.log(updates);
})
