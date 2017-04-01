'use strict'
const admin = require("firebase-admin");
const gcloud = require('google-cloud');
const serviceAccount = require("./fBServiceAccountKey_dev.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://srb-coasters-dev.firebaseio.com"
});

var db = admin.database();
var root = db.ref("data");

function migrateUsers() {
  root.child('user-coasters').once('value', (snap) => {
    let data = snap.val();
    let updates = {};
    updates['user-coasters'] = null;
    updates['users'] = data;
    return root.update(updates);
  })
}

function migrateCoasterHistory() {

  root.child('coasters').once('value', (snap) => {
    let coasters = snap.val();
    let updates = Object.keys(coasters).reduce((updates, key) => {
      let coaster = coasters[key];
      if (coaster.coasterHistory) {
        updates[`/${key}/history`] = coaster.coasterHistory;
        updates[`/${key}/coasterHistory`] = null;
      } else {
        updates[`/${key}/available`] = true;
      }
      return updates;
    }, {});

    return root.child('coasters').update(updates);

  })
}

function migrateCoasterComments() {

  root.child('coasters').once('value', (snap) => {
    let coasters = snap.val();
    let updates = Object.keys(coasters).reduce((updates, key) => {
      let coaster = coasters[key];
      if (coaster.coasterComments) {
        updates[`/${key}/comments`] = coaster.coasterComments;
        updates[`/${key}/coasterComments`] = null;
      }
      return updates;
    }, {});

    return root.child('coasters').update(updates);

  })
}

// root.child(`/coasters`).on('child_changed', (coaster) => {
//   // for each poster in history, copy coaster data
//   // users/${uid}/coasters/${coasterKey}/
//   // if coaster.heldBy, copy to users/${holdingUserUid}/holding/${coasterKey}
// 	Object.keys(coaster.coasterHistory)
// })

// migrateUsers();
// migrateCoasterHistory();
// migrateCoasterComments();
