'use strict';


const methods = {
	getUserToNofify (transaction) {
		return transaction.coveringFor.uid;
	},

	getNotieUpdates (coaster, userKey, notieKey, latestPickup, updates) {
		const message = `Your coaster has been picked up by ${latestPickup.pickedUpBy.name}`
		updates[`users/${userKey}/notifications/${notieKey}`] = { message, status: 'unread'}
		return updates;
	}
}
module.exports = methods

function getPickingUpUserName(latestPickup) {
	return latestPickup.pickedUpBy.name;
}
