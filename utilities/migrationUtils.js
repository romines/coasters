'use strict';
const database = require('./firebase.js').database();
const admin = require('./firebase.js');
const moment = require('moment');
const _ = require('underscore');

let root = database.ref("data");

const authUsers = require('./users')['users']; //.filter(rmTestUsers);
// console.log(authUsers);
// mergeUsers();
authUsers.forEach(user => console.log(user));
// rmTestUsers();

// console.log(authUsers.length);

function mergeUsers() {
  console.log('running mergeUsers . . .');
  const indexedAuthUsers = _.indexBy(authUsers, 'localId');

  root.child('users').once('value', (snap) => {
    let dbUsers = snap.val();
    console.log(`num users from db: ${Object.keys(dbUsers).length}`);
    console.log(`num users from auth: ${authUsers.length}`);
    let updates = {};
    Object.keys(dbUsers).forEach((dbUserKey) => {
      if (!indexedAuthUsers[dbUserKey]) {
        // console.log(dbUsers[dbUserKey]);
        updates[dbUserKey] = null;
      }
    })

    const authUserKeys = Object.keys(indexedAuthUsers);
    authUserKeys.forEach((key) => {
      const authUser = indexedAuthUsers[key];
      updates[`${key}`] = {
        uid: key,
        email: authUser.email,
        emailVerified: authUser.emailVerified,
        displayName: authUser.displayName,
        photoURL: authUser.photoUrl ? authUser.photoUrl : ''
      }

    })

    console.log(updates);
    // return root.child('users').update(updates);
  })
}
function rmTestUsers() {

	function isTestUser(user) {
		if (!user.email) {
			console.log(user);
		} else {
			return (user.email.includes('@email.com') || user.email.includes('@test.com'))
		}
	}

	console.log(`num users from auth: ${authUsers.length}`);
	console.log('num test users:' + authUsers.filter(isTestUser).length);
  let testUsers = authUsers.filter(isTestUser);
  let updates = {};

  testUsers.forEach((user) => {
    admin.auth().deleteUser(user.localId)
      .then(function() {
        console.log(`Successfully deleted user ${user.email}`);
        updates[user.localId] = null;
      })
      .catch(function(error) {
        console.log("Error deleting user:", error);
      });
  })
  root.child('users').update(updates)
    .then(() => console.log('Users ref updated'))
    .catch((e) => console.log(e));


	// const adams = authUsers.filter(user => user.email === 'adam.romines@gmail.com');
	// const adamUid = adams[0].localId;
	// admin.auth().getUser(adamUid)
  // .then(function(userRecord) {
  //   // See the UserRecord reference doc for the contents of userRecord.
  //   console.log("Successfully fetched user data:", userRecord.toJSON());
  // })
  // .catch(function(error) {
  //   console.log("Error fetching user data:", error);
  // });

}

/**
 *
 * Data restructure migration utils
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
