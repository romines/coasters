'use strict'
const admin = require("firebase-admin");
const gcloud = require('google-cloud');
const serviceAccount = require("./fBServiceAccountKey_dev.json");
const coasterFanout = require('../functions/coasterFanout.js')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://srb-coasters-dev.firebaseio.com"
});

let db = admin.database();
let root = db.ref("data");


root.child(`/coasters`).on('child_changed', (coaster) => {

  let updates = coasterFanout.getCoasterFanout(coaster.val())
  // root.update(updates)
})

// migrateUsers();
// migrateCoasterHistory();
// migrateCoasterComments();
coasterFanout();

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
