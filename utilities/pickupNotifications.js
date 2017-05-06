'use strict';
const moment = require('moment');
const encode = require('firebase-encode').encode;
const database = require('./firebase.js');

let root = database.ref("data");

module.exports = getPickupNotifications;

function getPickupNotifications(coaster, updates) {

	if (!coaster.history) return updates;

	const historyKeys  = Object.keys(coaster.history);
	const lastKey      = historyKeys[historyKeys.length -1];
	const latestPickup = coaster.history[historyKeys[historyKeys.length -1]];
	latestPickup.key   = lastKey;
	const userKey      = getUserToNofify(latestPickup);
	const notieKey     = root.child(`/users/${userKey}/notifications`).push().key;

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

function getPickingUpUserName(latestPickup) {
	return latestPickup.pickedUpBy.name;
}

function getUserToNofify (transaction) {
	if (!transaction.coveringFor) {
		console.log(transaction);
	} else {
		return transaction.coveringFor.uid;
	}
}
