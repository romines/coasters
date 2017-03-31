'use strict';
const functions = require('firebase-functions');
// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
exports.coasterFanout = functions.database.ref('/data/coasters')
    .onWrite(event => {
      // Grab the current value of what was written to the Realtime Database.
      const original = event.data.val();
      console.log(original);

    });
