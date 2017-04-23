'use strict';

const functions = require('firebase-functions');
const coasterFanout = require('./coasterFanout.js');
const pickupNotifications = require('./pickupNotifications.js')

exports.generateThumbnail = require('./generateThumbnail.js').generateThumbnail;

exports.fanoutAndNotifications = functions.database.ref('/data/coasters/{coasterId}')
  .onWrite(event => {
    // On coaster write, write updated coaster to /posted and /holding of
    // all posters in history, and currently hodling user respectively

    const coaster = event.data.val();
    const historyKeys = Object.keys(coaster.history);
    const latestPickup = coaster.history[historyKeys[historyKeys.length -1]];
    const userKey = pickupNotifications.getUserToNofify(latestPickup)
    const notieKey = root.child(`/users/${userKey}/notifications`).push().key

    let updates = coasterFanout.getCoasterFanout(coaster);

    // then add notifications for holding user to updates object
    //
    updates = pickupNotifications.getNotieUpdates(coaster, userKey, notieKey, latestPickup, updates);

    // get root reference and write all updates
    //
    let rootRef = event.data.ref.parent.parent.parent;
    let dataRef = rootRef.child('data')
    dataRef.update(updates);

  });
