'use strict';
const functions = require('firebase-functions');

exports.coasterFanout = functions.database.ref('/data/coasters')
    .onWrite(event => {
      // Grab the current value of what was written to the Realtime Database.
      const original = event.data.val();
      console.log(original);

    });
