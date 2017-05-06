'use strict';

function getCoasterFanout (coaster, updates) {

  console.log(`fanning out updates to: ${coaster.key}`);

  if (coaster.heldBy) updates[`/users/${coaster.heldBy.uid}/holding/${coaster.key}`] = coaster

  if (coaster.history) {
    updates = Object.keys(coaster.history).reduce((updates, key) => {
      let coveringFor = coaster.history[key].coveringFor;
      updates[`/users/${coveringFor.uid}/posted/${coaster.key}`] = coaster
      return updates
    }, updates)
  }
  return updates;
}

module.exports = getCoasterFanout;
