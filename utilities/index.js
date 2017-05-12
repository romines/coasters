'use strict'
const moment = require('moment');
const _ = require('underscore');
// const gcloud = require('google-cloud');
const coasterFanout = require('./coasterFanout.js');
const getPickupNotifications = require('./pickupNotifications.js');
const database = require('./firebase.js');
const authUsers = require('./users')['users']; //.filter(rmTestUsers);


// console.log(authUsers.length);

function rmTestUsers(user) {
  return !(user.email.includes('@email.com') || user.email.includes('@test.com'))
}

let root = database.ref("data");

// mergeUsers();


function mergeUsers() {
  console.log('running mergeUsers . . .');
  const indexedAuthUsers = _.indexBy(authUsers, 'localId');
  // console.log(indexedAuthUsers);
  root.child('users').once('value', (snap) => {
    let dbUsers = snap.val();
    console.log(`num users from db: ${Object.keys(dbUsers).length}`);
    console.log(`num users from auth: ${authUsers.length}`);

    // console.log({count});
    let updates = Object.keys(indexedAuthUsers).reduce((updates, uid) => {
      let userData = dbUsers[uid] ? dbUsers[uid] : {};
      let authUserData = indexedAuthUsers[uid];
      userData.uid = uid;
      userData.email = authUserData.email;
      userData.emailVerified = authUserData.emailVerified;
      userData.displayName = authUserData.displayName;
      if (!userData.photoURL) {
        if (authUserData.photoURL) {
          userData.photoURL = authUserData.photoURL;
        }
      }
      updates[`${uid}`] = userData;
      return updates;
    }, {});
    console.log(updates);
    return root.child('users').set(updates);
  })
}







// root.child(`/coasters`).on('child_changed', (refData) => {
//   console.log('there was a change . . .');
//   let updates   = {};
//   const coaster = refData.val();
//   if (!coaster.key) {console.log(coaster);}
//   else {
//
//     updates = coasterFanout(coaster, updates);
//
//
//   }
//
//   updates = getPickupNotifications(coaster, updates);
//
//   root.update(updates);
//
// })


/**
 *
 * Migration utils
 *
 *
 */

// migrateUsers();
// migrateCoasterHistory();
//
// Turn fanOut ON after migrateUsers and migrateCoasterHistory
//
// migrateCoasterComments();
// migratePostedFromDisplayNameToName();
// setHistoryData();
// setHeldBy();


function migrateUsers() {
  console.log('running migrateUsers . . .');
  root.child('user-coasters').once('value', (snap) => {
    let data = snap.val();
    let updates = {};
    updates['user-coasters'] = null;
    updates['users'] = data;
    return root.update(updates);
  })
}


function migrateCoasterHistory() {

  console.log('running migrateCoasterHistory . . .');

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

/**
 *
 * Turn fanout ON after running above migrations
 *
 *
 */

function migrateCoasterComments() {
  console.log('running migrateCoasterComments . . .');
  //
  // coaster.coasterComments => coaster.comments
  //
  // Fanout ON
  //
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

function setHistoryData() {
  console.log('running setHistoryData . . .');
  // transforms first (only) history transaction to object of the form:
  //
  // { coveringFor: [userObj],
  //   postedBy: [userObj],
  //   posted: [timestamp],
  //   pickedUp: [timestamp] }
  //
  // Run migrateCoasterHistory first
  // Run with fanOut ON
  //
  //
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

function setHeldBy() {
  console.log('running setHeldBy . . .');
  //
  // Sets heldBy property to first (only) [historyItem].pickedUpBy
  // if historyItem exists, otherwise orignal poster
  //
  // Also sets available based on status
  //

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


function migratePostedFromDisplayNameToName() {

  //
  // coaster.postedBy.displayName => coaster.postedBy.name
  //
  // Might not be necessary...fixed bad data coming from
  // web app bug
  //

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
/**
 *
 * Utils and old migrations
 *
 *
 */

function doMigrateDisplayName() {
  setTimeout(migratePostedFromDisplayNameToName, 300);
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





function migrateCoveringFor() {
  //
  // Changes history[key].coveringFor => history[key].pickedUpBy
  //
  // DO NOT USE
  //
  console.log('Whyyyyyyy..........??');
  return;

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
