/**
 * Adapted from https://github.com/firebase/functions-samples/tree/master/generate-thumbnail
 * (Apache licensed)
 *
 */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
const LOCAL_TMP_FOLDER = '/tmp/';

admin.initializeApp(functions.config().firebase);
let root = admin.database().ref('data');


// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 200;
const THUMB_MAX_WIDTH = 200;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'usr_';

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
exports.generateThumbnail = functions.storage.object().onChange(event => {
  const filePath = event.data.name;
  const filePathSplit = filePath.split('/');
  const fileName = filePathSplit.pop();
  const fileDir = filePathSplit.join('/') + (filePathSplit.length > 0 ? '/' : '');
  const uid = fileName.split('.')[0];
  console.log('***** UID is: ' + fileDir);
  const thumbFilePath = `${fileDir}${THUMB_PREFIX}${fileName}`;
  const tempLocalDir = `${LOCAL_TMP_FOLDER}${fileDir}`;
  const tempLocalFile = `${tempLocalDir}${fileName}`;
  const tempLocalThumbFile = `${LOCAL_TMP_FOLDER}${thumbFilePath}`;

  // Exit if this is triggered on a file that is not an image.
  if (!event.data.contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return;
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX)) {
    console.log('Already a Thumbnail.');
    return;
  }

  // Exit if this is a move or deletion event.
  if (event.data.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return;
  }



  function getImageUpdates (userCoasters, url) {

    let coastersPostedUpdates = Object.keys(userCoasters.posted).reduce((updates, key) => {

      updates[`/user-coasters/${uid}/posted/${key}/postedBy/photoURL`] = url;
      if (userCoasters[uid]['posted'][key]['coasterHistory']) {
        let coasterHistory = userCoasters[uid]['posted'][key]['coasterHistory'];
        for (historyItem in coasterHistory) {
          if coasterHistory[historyItem].coveringFor.uid === uid {
            updates[`/user-coasters/${uid}/posted/${key}/coasterHistory/${historyItem}/coveringFor/photoURL`] = url;
            updates[`/coasters/${key}/coasterHistory/${historyItem}/coveringFor/photoURL`] = url;
          }
          if coasterHistory[historyItem].pickedUpBy.uid === uid {
            updates[`/user-coasters/${uid}/posted/${key}/coasterHistory/${historyItem}/pickedUpBy/photoURL`] = url;
            updates[`/coasters/${key}/coasterHistory/${historyItem}/pickedUpBy/photoURL`] = url;
          }
        }
      }

      return updates;

    }, {});

    return Object.keys(userCoasters['picked-up']).reduce((updates, key) => {

      if (userCoasters[uid]['picked-up'][key]['coasterHistory']) {
        let coasterHistory = userCoasters[uid]['picked-up'][key]['coasterHistory'];
        for (historyItem in coasterHistory) {
          if coasterHistory[historyItem].coveringFor.uid === uid {
            updates[`/user-coasters/${uid}/posted/${key}/coasterHistory/${historyItem}/coveringFor/photoURL`] = url;
            updates[`/coasters/${key}/coasterHistory/${historyItem}/coveringFor/photoURL`] = url;
          }
          if coasterHistory[historyItem].pickedUpBy.uid === uid {
            updates[`/user-coasters/${uid}/posted/${key}/coasterHistory/${historyItem}/pickedUpBy/photoURL`] = url;
            updates[`/coasters/${key}/coasterHistory/${historyItem}/pickedUpBy/photoURL`] = url;
          }
        }
      }

      return updates;

    }, coastersPostedUpdates);

  }


  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    const bucket = gcs.bucket(event.data.bucket);
    return bucket.file(filePath).download({
      destination: tempLocalFile
    }).then(() => {
      return spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile]).then(() => {
        return bucket.upload(tempLocalThumbFile, {
          destination: thumbFilePath
        }).then(() => {
          root.child(`/user-coasters/${uid}`).once((userCoasters) => {
            let updates = getImageUpdates(userCoasters);
            console.console.log(updates);
          })

        });
      });
    });
  });
});
