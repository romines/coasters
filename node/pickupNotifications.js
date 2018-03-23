'use strict';
const moment = require('moment');
const encode = require('firebase-encode').encode;
const database = require('./firebase.js').database();
const isTrade = require('./utilities').isTrade;

let root = database.ref("data");

module.exports = function (coaster) {

	let promise = new Promise(function(resolve, reject) {

		if (!coaster.history) {
			return resolve({});
		}
		else {
			const historyKeys = Object.keys(coaster.history);
			const lastKey     = historyKeys[historyKeys.length -1];
      const latestEntry = coaster.history[lastKey];

      let updates = {};

      if (isTrade(latestEntry)) {

        const userKey     = getUserToNotify(latestEntry);
        const notieKey    = root.child(`/users/${userKey}/notifications`).push().key;

        if (!latestEntry.notieSent) {
          const dateString  = moment(coaster.date).format('ddd. MMM, Do');
          const markup      = `<a href="/#/coasters/${coaster.key}">${dateString} ${coaster.time} ${coaster.shiftType} shift</a>`;
          const coasterLink = encode(markup);
          const message     = `Your ${coasterLink} has been picked up by ${latestEntry.pickedUpBy.name}`
          updates[`users/${userKey}/notifications/${notieKey}`] = { message, status: 'unread'};
          updates[`coasters/${coaster.key}/history/${lastKey}/notieSent`] = true;
        }
      }

      resolve(updates);
		}
  });

  return promise;

}

function getPickingUpUserName(latestEntry) {
	return latestEntry.pickedUpBy.name;
}

function getUserToNotify (transaction) {
	if (!transaction.coveringFor) {
		console.log(transaction);
	} else {
		return transaction.coveringFor.uid;
	}
}

