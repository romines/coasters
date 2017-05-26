'use strict';

function getCoasterFanout (coaster, updates) {

  console.log(`fanning out updates for: ${coaster.key}`);

  const isTrade = (historyItem) => {
    if (historyItem.type && historyItem.type !== 'TRADE') {
      return false;
    } else {
      return true;
    }
  };

  if (coaster.heldBy) updates[`/users/${coaster.heldBy.uid}/holding/${coaster.key}`] = coaster

  if (coaster.history) {
    updates = Object.keys(coaster.history).reduce((updates, key) => {
      let historyItem = coaster.history[key];

      if (isTrade(historyItem)) {
        let coveringFor = coaster.history[key].coveringFor;
        updates[`/users/${coveringFor.uid}/posted/${coaster.key}`] = coaster
      }
      return updates

    }, updates)

  } else {
    updates[`/users/${coaster.postedBy.uid}/posted/${coaster.key}`] = coaster
  }
  return updates;
}

module.exports = getCoasterFanout;
