/**
 * Adapted from https://github.com/firebase/functions-samples/tree/master/generate-thumbnail
 * (Apache licensed)
 *
 */
'use strict';

require('@google-cloud/debug-agent').start({ allowExpressions: true });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;
const getImageUpdates = require('./images.js').getImageUpdates;

const LOCAL_TMP_FOLDER = '/tmp/';
const DEBUG = false;
const THUMB_MAX_HEIGHT = 200; // in pixels
const THUMB_MAX_WIDTH = 200;
const THUMB_PREFIX = 'usr_';

admin.initializeApp(functions.config().firebase);
let root = admin.database().ref('data');
/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
exports.generateThumbnail = functions.storage.object().onChange(event => {
  const filePath = event.data.name;
  DEBUG && console.log('***** filePath is: ' + filePath);
  const filePathSplit = filePath.split('/');
  DEBUG && console.log('***** filePathSplit is: ' + filePathSplit);
  const fileName = filePathSplit.pop();
  DEBUG && console.log('***** fileName is: ' + fileName);
  const fileDir = filePathSplit.join('/') + (filePathSplit.length > 0 ? '/' : '');
  DEBUG && console.log('***** fileDir is: ' + fileDir);
  const uid = fileName.split('.')[0];
  DEBUG && console.log('***** uid is: ' + uid);
  const thumbFilePath = `${fileDir}${THUMB_PREFIX}${fileName}`;
  DEBUG && console.log('***** thumbFilePath is: ' + thumbFilePath);

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



  return mkdirp(tempLocalDir).then(() => {
    // Download file from bucket.
    const bucket = gcs.bucket(event.data.bucket);
    return bucket.file(filePath).download({
      destination: tempLocalFile
    }).then(() => {
      return spawn('convert', [tempLocalFile, '-thumbnail', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`, tempLocalThumbFile]).then(() => {
        return bucket.upload(tempLocalThumbFile, {
          destination: thumbFilePath
        }).then((data) => {

          console.log(data[0].metadata);

          let myUri = data[0].metadata.mediaLink;
          // root.child(`/user-coasters/${uid}`).once('value', (userCoasters) => {
          //   if (!userCoasters.val()) return;
          //   console.log(userCoasters.val());
          //   let updates = getImageUpdates(userCoasters.val(), 'this is the new path...', uid);
          //   DEBUG && console.log(updates);
          //   if (Object.keys(updates).length < 1) {
          //     console.log('Updates object was empty . . .');
          //     return;
          //   }
          //   root.update(updates);
          // })
          root.child('/coasters').once('value', (coasters) => {
            let updates = getImageUpdates(coasters.val(), myUri, uid);
            console.log(updates);
            root.update(updates);
          })

        });
      });
    });
  });
});
