'use strict';

exports.getImageUpdates = function (coasters, url, uid) {

  let myPostedCoaseters = Object.keys(coasters).filter((key) => {
    return coasters[key].postedBy.uid === uid;
  }).reduce((updates, key) => {
    updates[`/coasters/${key}/postedBy/photoURL`] = url;
    return updates;
  }, {});

  return myPostedCoaseters;

};
