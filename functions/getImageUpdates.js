'use strict';

exports.getImageUpdates = function (coasters, url, uid) {
  // console.log(coasters);
  // return {};

  let myPostedCoaseters = Object.keys(coasters).filter((key) => {
    return coasters[key].postedBy.uid === uid;
  }).reduce((updates, key) => {
    updates[`/coasters/${key}/postedBy/photoURL`] = url;
    return updates;
  }, {});

  return myPostedCoaseters;

	// const DEBUG = true;
	// console.log({userCoasters, url, uid});
	// DEBUG && console.log(userCoasters.posted);
	// let coastersPostedUpdates = {};
  //
	// if (userCoasters.posted) {
  //
	// 	coastersPostedUpdates = Object.keys(userCoasters.posted).reduce((updates, key) => {
	// 		updates[`/user-coasters/${uid}/posted/${key}/postedBy/photoURL`] = url;
	// 		if (userCoasters.posted[key]['coasterHistory']) {
	// 			if (!userCoasters[uid]) {
	// 				DEBUG && console.log('why are you checking for ' + uid + ' ??');
	// 				return;
	// 			}
	// 			DEBUG && console.log(userCoasters[uid]);
	// 			let coasterHistory = userCoasters[uid]['posted'][key]['coasterHistory'];
	// 			for (let historyItem in coasterHistory) {
	// 				if (coasterHistory[historyItem].coveringFor.uid === uid) {
	// 					updates[`/user-coasters/${uid}/posted/${key}/coasterHistory/${historyItem}/coveringFor/photoURL`] = url;
	// 					updates[`/coasters/${key}/coasterHistory/${historyItem}/coveringFor/photoURL`] = url;
	// 				}
	// 				if (coasterHistory[historyItem].pickedUpBy.uid === uid) {
	// 					updates[`/user-coasters/${uid}/posted/${key}/coasterHistory/${historyItem}/pickedUpBy/photoURL`] = url;
	// 					updates[`/coasters/${key}/coasterHistory/${historyItem}/pickedUpBy/photoURL`] = url;
	// 				}
	// 			}
	// 		}
  //
	// 		return updates;
  //
	// 	}, {});
  //
	// }
  //
	// if (!userCoasters['picked-up']) return coastersPostedUpdates;
  //
	// return Object.keys(userCoasters['picked-up']).reduce((updates, key) => {
	// 	console.log({updates});
	// 	if (userCoasters['picked-up'][key]['coasterHistory']) {
	// 		let coasterHistory = userCoasters['picked-up'][key]['coasterHistory'];
	// 		for (let historyItem in coasterHistory) {
	// 			console.log({historyItem});
	// 			if (coasterHistory[historyItem].coveringFor.uid === uid) {
	// 				updates[`/user-coasters/${uid}/posted/${key}/coasterHistory/${historyItem}/coveringFor/photoURL`] = url;
	// 				updates[`/coasters/${key}/coasterHistory/${historyItem}/coveringFor/photoURL`] = url;
	// 			}
	// 			if (coasterHistory[historyItem].pickedUpBy.uid === uid) {
	// 				updates[`/user-coasters/${uid}/posted/${key}/coasterHistory/${historyItem}/pickedUpBy/photoURL`] = url;
	// 				updates[`/coasters/${key}/coasterHistory/${historyItem}/pickedUpBy/photoURL`] = url;
	// 			}
	// 		}
	// 	}
  //
	// 	return updates;
  //
	// }, coastersPostedUpdates);
};
