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
const environment = process.env.GCLOUD_PROJECT === 'srb-coasters' ? 'production' : 'development';

// deal with this
const gcs = require('@google-cloud/storage')({keyFilename: `firebase_account_key-${environment}.json`});
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
      return spawn('convert', [tempLocalFile, '-resize', `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}`, '-auto-orient', tempLocalThumbFile]).then(() => {
        return bucket.upload(tempLocalThumbFile, {
          destination: thumbFilePath
        }).then(() => {

          bucket.file(thumbFilePath).getSignedUrl({action:'read', expires:'03-30-2025'}, (err, url) => {
            if (err) {
              console.error(err);
              return;
            }


            root.child(`/users/${uid}`).once('value', (snap) => {

              let userUpdates                       = {};
              userUpdates[`/users/${uid}/photoURL`] = url;

              let userData                          = snap.val();

              let getUpdates = new Promise((resolve, reject) => {

                if (userData !== null) {
                  
                  if (userData.posted) {
                    
                    userUpdates = Object.keys(userData.posted).reduce((updates, key) => {
                      let coaster = userData.posted[key];
                      if (coaster.postedBy.uid === uid) {
                        let coasterKey = coaster.key;
                        updates[`/coasters/${coasterKey}/postedBy/photoURL`] = url;
                      } 
                      return updates;
                    }, userUpdates);
                  }
  
                  if (userData.holding) {
                    userUpdates = Object.keys(userData.holding).reduce((updates, key) => {
                      let coaster = userData.holding[key];
                      let coasterKey = coaster.key;
                      updates[`/coasters/${coasterKey}/holding/photoURL`] = url;
                      return updates;
                    }, userUpdates);
                  }
  
                  if (userData.coastersCommentedOn) {
                    
                    let commentUpdates = {};
  
                    var getCoaster = (coasterKey) => {
                      return new Promise((resolve, reject) => {
                        root.child(`coasters/${coasterKey}`).once('value', (snap) => {
                          let coaster = snap.val();
                          let commentKeys = Object.keys(coaster.comments).filter((commentKey) => {
                            return coaster.comments[commentKey].postedBy.uid === uid;
                          });
                          commentKeys.forEach((commentKey) => {
                            commentUpdates[`/coasters/${coasterKey}/comments/${commentKey}/postedBy/photoURL`] = url;
                          });
                          console.log('fetched a coaster commented on . . . resolving inner promise');
                          resolve();
                        })
                      });
                    };
                    var commentPromises = Object.keys(userData.coastersCommentedOn).map(getCoaster);
                    Promise.all(commentPromises).then(() => {
                      let combined = Object.assign(userUpdates, commentUpdates);
                      
                      resolve(combined);
                    });
                  } else {
                    resolve(userUpdates);
                  }
  
                } else {
                  reject(`HOWDY. No data was found at /users/${uid}/`);
                }

              });

              getUpdates.then((updates) => {
                root.update(updates);
              }, e => console.log);

            })

          })

        });

      });
    });
  });
});
