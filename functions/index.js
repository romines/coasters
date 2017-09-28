'use strict';

const functions = require('firebase-functions');

exports.generateThumbnail = require('./generateThumbnail.js').generateThumbnail;

exports.fooBar = functions.database.ref('/data/coasters/{coasterId}')
  .onWrite(event => {
	const config = functions.config();
	const environment = process.env;
	console.log({config, environment});

    const coaster = event.data.val();
    let rootRef = event.data.ref.parent.parent.parent;
    let dataRef = rootRef.child('data')

		console.log({event, coaster});

  });
