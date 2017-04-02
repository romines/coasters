'use strict';

const functions = require('firebase-functions');
const coasterFanout = require('./coasterFanout.js');

exports.generateThumbnail = require('./generateThumbnail.js').generateThumbnail;

exports.coasterFanout = functions.database.ref('/data/coasters')
.onWrite(event => {
  // Grab the current value of what was written to the Realtime Database.
  const original = event.data.val();
  coasterFanout();

});
