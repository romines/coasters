'use strict';

const functions = require('firebase-functions');
const coasterFanout = require('./coasterFanout.js');
const pickupNotifications = require('./pickupNotifications.js')

exports.generateThumbnail = require('./generateThumbnail.js').generateThumbnail;

exports.fanoutAndNotifications = functions.database.ref('/data/coasters/{coasterId}')
  .onWrite(event => {
    // On coaster write, write updated coaster to /posted and /holding of
    // all posters in history, and currently hodling user respectively

    // TODO detect pickup, 'send' notifications to user

    const coaster = event.data.val();
    const historyKeys = Object.keys(coaster.history);
    const latestPickup = coaster.history[historyKeys[historyKeys.length -1]];
    const userKey = pickupNotifications.getUserToNofify(latestPickup)
    const notieKey = root.child(`/users/${userKey}/notifications`).push().key

    let updates = coasterFanout.getCoasterFanout(coaster);
    updates = pickupNotifications.getNotieUpdates(coaster, userKey, notieKey, latestPickup, updates);
    let rootRef = event.data.ref.parent.parent.parent;
    let dataRef = rootRef.child('data')
    dataRef.update(updates);

  });

exports.notifyOnPickup = functions.database.ref('/data/coasters/{coasterId}/history/{transactionKey}')
  .onWrite(event => {
    // On coaster write, write updated coaster to /posted and /holding of
    // all posters in history, and currently hodling user respectively

    // TODO detect pickup, 'send' notifications to user

    const transaction = event.data.val();
    let updates = pickupNotifications(transaction);
    let rootRef = event.data.ref.parent.parent.parent.parent.parent;
    let dataRef = rootRef.child('data')
    // dataRef.update(updates);
    console.log(updates);
  });
