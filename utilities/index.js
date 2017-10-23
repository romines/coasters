'use strict'

const coasterFanout = require('./coasterFanout.js');
const getPickupNotifications = require('./pickupNotifications.js');
const database = require('./firebase.js').database();
// const utilities = require('./migrationUtils.js');
// utilities.rmAllUsers();

let root = database.ref("data");

root.child(`/coasters`).on('child_changed', (refData) => {
  console.log('there was a change to a coaster . . .');
  let updates   = {};
  const coaster = refData.val();
  if (!coaster.key) {console.log(coaster);}
  else {

    updates = coasterFanout(coaster, updates);

  }

  updates = getPickupNotifications(coaster, updates);

  root.update(updates);

})

root.child('users').on('child_changed', (refData) => {
  
  const user = refData.val();

})
