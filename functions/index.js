'use strict';
exports.generateThumbnail = functions.database.ref('/data/something/that/will/never/be/hit')
  .onWrite(event => {
		return
  });

exports.fanoutAndNotifications = functions.database.ref('/data/something/that/will/never/be/hit')
  .onWrite(event => {
		return
  });
