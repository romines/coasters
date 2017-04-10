'use strict';

const functions = require('firebase-functions');
const coasterFanout = require('./coasterFanout.js');

exports.generateThumbnail = require('./generateThumbnail.js').generateThumbnail;

exports.coasterFanout = functions.database.ref('/data/coasters/{coasterId}')
.onWrite(event => {
  // Grab the current value of what was written to the Realtime Database.
  const coaster = event.data.val();
  let updates = coasterFanout.getCoasterFanout(coaster);
  let rootRef = event.data.ref.parent.parent.parent;
  let dataRef = rootRef.child('data')
  dataRef.update(updates);

});