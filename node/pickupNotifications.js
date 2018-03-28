/* eslint-env node */
'use strict';

const moment = require('moment');
const encode = require('firebase-encode').encode;
const database = require('./firebase.js').database();
const sendSMS = require('./sendSMS.js');
const isTrade = require('./utilities').isTrade;
const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

const appURL = {
  development : 'https://srb-coasters-dev.firebaseapp.com/#/coasters/',
  staging : 'https://srb-coasters-staging.firebaseapp.com/#/coasters/',
  production : 'https://srb-coasters.firebaseapp.com/#/coasters/'
};

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

      if (isTrade(latestEntry) && !latestEntry.notieSent) {

        const userKey     = getUserToNotify(latestEntry);
        const notieKey    = root.child(`/users/${userKey}/notifications`).push().key;

        const dateString  = moment(coaster.date).format('ddd. MMM, Do');
        const markup      = `<a href="/#/coasters/${coaster.key}">${dateString} ${coaster.time} ${coaster.shiftType} shift</a>`;
        const coasterLink = encode(markup);
        const message     = `Your ${coasterLink} has been picked up by ${latestEntry.pickedUpBy.name}`

        updates[`users/${userKey}/notifications/${notieKey}`] = { message, status: 'unread' };
        updates[`coasters/${coaster.key}/history/${lastKey}/notieSent`] = true;

        root.child(`/users/${userKey}`).once('value').then(snap => {
          const userData = snap.val();
          if (userData.sms) {
            const smsMessage  = `Your ${coaster.time} ${coaster.shiftType} shift has been picked up by ${latestEntry.pickedUpBy.name}. View/comment here: ${appURL[environment]}${coaster.key}`
            sendSMS(userData.sms, smsMessage, userData.displayName);
          }
          resolve(updates);
        })

      }


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

