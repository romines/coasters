'use strict';

const functions = require('firebase-functions');
// const coasterFanout = require('./coasterFanout.js');

exports.generateThumbnail = require('./generateThumbnail.js').generateThumbnail;

// exports.coasterFanout = functions.database.ref('/data/coasters/{coasterId}')
//   .onWrite(event => {
//     // On coaster write, write updated coaster to /posted and /holding of
//     // all posters in history, and currently hodling user respectively
//
//     // TODO detect pickup, 'send' notifications to user
//
//     const coaster = event.data.val();
//     let updates = coasterFanout.getCoasterFanout(coaster);
//     let rootRef = event.data.ref.parent.parent.parent;
//     let dataRef = rootRef.child('data')
//     dataRef.update(updates);
//
//   });
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
