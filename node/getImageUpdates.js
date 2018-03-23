// 'use strict';
//
// exports.getImageUpdates = function (coasters, url, uid) {
//
//   let myPostedCoasters = Object.keys(coasters).filter((key) => {
//     return coasters[key].postedBy.uid === uid;
//   }).reduce((updates, key) => {
//     updates[`/coasters/${key}/postedBy/photoURL`] = url;
//     return updates;
//   }, {});
//
//   let postedAndHoldingCoasters = Object.keys(coasters).filter((key) => {
//     return coasters[key].heldBy.uid === uid;
//   }).reduce((updates, key) => {
//     updates[`/coasters/${key}/heldBy/photoURL`] = url;
//     updates
//   })
//
//   return myPostedCoaseters;
//
// };
