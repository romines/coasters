/* eslint-env node */
'use strict'

const database                = require('./firebase.js').database();
const fanOutUpdates           = require('./coasterFanout.js');
const sendPickupNotifications = require('./pickupNotifications.js');
const isTrade                 = require('./utilities').isTrade;

// const migrations = require('./migrationUtils.js');
// migrations.rmAllUsers();

let root = database.ref("data");

root.child(`/coasters`).on('child_changed', (refData) => {
  console.log('there was a change to a coaster . . .');
  const coaster = refData.val();

  if (!coaster.key) { return console.log('Keyless coaster: ', coaster);}
  if (!coaster.history) { return console.log('No history to fanout...');}

  const historyKeys = Object.keys(coaster.history);
  const lastKey     = historyKeys[historyKeys.length -1];
  const latestEntry = coaster.history[lastKey];

  if (isTrade(latestEntry)) {
    sendPickupNotifications(coaster).then((notificationData) => {
      root.update(fanOutUpdates(coaster, notificationData));
    })
  } else {
    root.update(fanOutUpdates(coaster, {}));
  }

})
