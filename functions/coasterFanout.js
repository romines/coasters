'use strict';

exports.getCoasterFanout = function (coaster) {

  let updates = {}
  if (coaster.heldBy) updates[`/users/${coaster.heldBy.uid}/holding/${coaster.key}`] = coaster

  return Object.keys(coaster.history).reduce((updates, key) => {
    let postedBy = coaster.history[key].postedBy
    // let postedBy = coaster.history[key].coveringFor
    // console.log({key, postedBy});
    updates[`/users/${postedBy.uid}/posted/${coaster.key}`] = coaster
    return updates
  }, updates)

}
