'use strict';
/**
 * Adapted from https://github.com/firebase/functions-samples/tree/master/generate-thumbnail
 * (Apache licensed)
 *
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mkdirp = require('mkdirp-promise');
const spawn = require('child-process-promise').spawn;
const gcs = require('@google-cloud/storage')({keyFilename: 'fBServiceAccountKey_dev.json'});
const getImageUpdates = require('./getImageUpdates.js').getImageUpdates;

const LOCAL_TMP_FOLDER = '/tmp/';
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
  const filePathSplit = filePath.split('/');
  const fileName = filePathSplit.pop();
  const fileDir = filePathSplit.join('/') + (filePathSplit.length > 0 ? '/' : '');
  const uid = fileName.split('.')[0];
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

          bucket.file(thumbFilePath).getSignedUrl({action:'read', expires:'03-30-2025'}, (err, url) => {
            if (err) {
              console.error(err);
              return;
            }
            root.child('/coasters').once('value', (coasters) => {
              let updates = getImageUpdates(coasters.val(), url, uid);
              console.log(updates);
              root.update(updates);
            })

          })

        });

      });
    });
  });
});
