'use strict';

const functions = require('firebase-functions');

exports.generateThumbnail = require('./generateThumbnail.js').generateThumbnail;

exports.logEventData = functions.database.ref('/data/coasters/{coasterId}')
  .onWrite(event => {
    const config = functions.config();
    const environment = process.env;

    const coaster = event.data.val();
    let rootRef = event.data.ref.parent.parent.parent;
    let dataRef = rootRef.child('data')

    console.log({event, config, environment, coaster});

    return null;

  });
