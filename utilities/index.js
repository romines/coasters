'use strict'
const admin = require("firebase-admin");
const moment = require('moment');
const gcloud = require('google-cloud');
const serviceAccount = require("./fBServiceAccountKey_admin.json");
const coasterFanout = require('./coasterFanout.js');
const pickupNotifications = require('./pickupNotifications.js')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://srb-coasters-dev.firebaseio.com"
});

let db = admin.database();
let root = db.ref("data");


root.child(`/coasters`).on('child_changed', (refData) => {

  let updates   = {};
  const coaster = refData.val();

  if (coaster.history) {
    const historyKeys  = Object.keys(coaster.history);
    const lastKey      = historyKeys[historyKeys.length -1];
    const latestPickup = coaster.history[historyKeys[historyKeys.length -1]];
    latestPickup.key   = lastKey;
    const userKey      = pickupNotifications.getUserToNofify(latestPickup);
    const notieKey     = root.child(`/users/${userKey}/notifications`).push().key;
    //
    //
    // if change was due to a pickup event
    // ...modify in place w/ pickup notifications
    //
    updates = pickupNotifications.getNotieUpdates(coaster, userKey, notieKey, latestPickup, updates);

  }
  //
  // Always apply fanout though
  //
  //
  updates = coasterFanout(coaster, updates);

  root.update(updates);

})

// migrateUsers();
// migrateCoasterHistory();
// migrateCoasterComments();
// migrateCoveringFor()
// setHeldBy();
// setOriginallyPostedData();
// doMigrateDisplayName();
// doTouchAll();

function migrateCoveringFor() {
  root.child('coasters').once('value', (snap) => {
    let coasters = snap.val()
    // console.log(coasters);
    let updates = Object.keys(coasters).reduce((updates, key) => {
      let coaster = coasters[key]
      // console.log(key);
      // console.log(coaster.history);

      if (coaster.history) {
        let historyKeys = Object.keys(coaster.history)
        let historyUpdates = {}
        for (var i = 0; i < historyKeys.length; i++) {
          let historyKey = historyKeys[i]
          let historyItem = coaster.history[historyKey]
          let postedBy = Object.assign({}, historyItem.coveringFor)
          historyItem.coveringFor = null
          historyItem.postedBy = postedBy
          historyUpdates[historyKey] = historyItem

        }
        updates[`${key}/history`] = historyUpdates
      }
      return updates

    }, {})
    root.child('coasters').update(updates);
  })
}

function setOriginallyPostedData() {
  root.child('coasters').once('value', (snap) => {
    let coasters = snap.val()
    let updates = Object.keys(coasters).reduce((updates, key) => {
      let coaster = coasters[key]

      if (coaster.history) {
        let originallyPosted = coaster.posted;
        let orginalPoster = coaster.postedBy;
        let historyKeys = Object.keys(coaster.history);
        let firstHistoryKey = historyKeys[0];
        let firstHistoryItem = Object.assign({}, coaster.history[firstHistoryKey]);
        firstHistoryItem.coveringFor = coaster.postedBy;
        firstHistoryItem.posted = originallyPosted;
        firstHistoryItem.pickedUp = firstHistoryItem.when;
        firstHistoryItem.when = null;
        updates[`${key}/history/${firstHistoryKey}`] = firstHistoryItem;
      }
      return updates

    }, {})
    console.log(updates);
    root.child('coasters').update(updates);
  })
}

function doMigrateDisplayName() {
  setTimeout(migratePostedFromDisplayNameToName, 300);
}

function migratePostedFromDisplayNameToName() {

  root.child('coasters').once('value', (snap) => {
    let coasters = snap.val()
    let updates = Object.keys(coasters).reduce((updates, key) => {
      if (coasters[key].postedBy.displayName) {
        updates[`${key}/postedBy/displayName`] = null;
        updates[`${key}/postedBy/name`] = coasters[key].postedBy.displayName;
      }
      return updates;
    }, {});
    return root.child('coasters').update(updates);
  })

}


function doTouchAll() {
  setTimeout(touchAll, 400)
}
function touchAll() {
  root.child('coasters').once('value', (snap) => {
    let coasters = snap.val();
    let now = moment().format();
    let updates = Object.keys(coasters).reduce((updates, key) => {
      updates[`${key}/meta/touched`] = now;
      return updates;
    }, {});
    return root.child('coasters').update(updates);

  })
}

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
        updates[`/${key}/available`] = false;
      } else {
        updates[`/${key}/available`] = true;
      }
      return updates;
    }, {});

    return root.child('coasters').update(updates);

  })
}

function setHeldBy() {

  root.child('coasters').once('value', (snap) => {
    let coasters = snap.val();
    let updates = Object.keys(coasters).reduce((updates, key) => {
      let coaster = coasters[key];
      if (coaster.history) {
        let historyKeys = Object.keys(coaster.history);
        let lastKey = historyKeys[historyKeys.length - 1];
        updates[`/${key}/heldBy`] = coaster.history[lastKey].pickedUpBy;
        updates[`/${key}/available`] = false;
      } else {
        updates[`/${key}/heldBy`] = coaster.postedBy;
      }
      return updates;
    }, {});
    console.log(updates);
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
