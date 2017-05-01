'use strict';
const moment = require('moment');
const encode = require('firebase-encode').encode;

const methods = {
	getUserToNofify (transaction) {
		console.log(transaction);
		return transaction.coveringFor.uid;
	},

	getNotieUpdates (coaster, userKey, notieKey, latestPickup, updates) {

		if (!latestPickup.notieSent) {
			const dateString  = moment(coaster.date).format('ddd. MMM, Do');
			const markup      = `<a href="/#/coasters/${coaster.key}">${dateString} ${coaster.time} ${coaster.shiftType} shift</a>`;
			const coasterLink = encode(markup);
			const message     = `Your ${coasterLink} has been picked up by ${latestPickup.pickedUpBy.name}`
			updates[`users/${userKey}/notifications/${notieKey}`] = { message, status: 'unread'};
			updates[`coasters/${coaster.key}/history/${latestPickup.key}/notieSent`] = true;
		}

		return updates;
	}
}
module.exports = methods

function getPickingUpUserName(latestPickup) {
	return latestPickup.pickedUpBy.name;
}
