'use strict'
const admin = require("firebase-admin");
const gcloud = require('google-cloud');
const uid = 'ZIpb1b0NJjePATkTJRrNUF7WvWu2';
const serviceAccount = require("./fBServiceAccountKey_dev.json");

// gcloud.storage({
//   projectId: 'srb-coasters-dev', // 559488726085
//   credentials: serviceAccount
// }).getBucketsStream()
//   .on('error', console.error)
//   .on('data', function(bucket) {
//     console.log(bucket);
//   });


// .getBuckets((err, buckets) => {
//   if (err) console.error(err)
//   else {
//     console.log(buckets[0].metadata);
//   }
// });


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://srb-coasters-dev.firebaseio.com"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var root = db.ref("data");

// bucket.getFilesStream()
//   .on('error', console.error)
//   .on('data', (data) => {
//     console.log(data);
//   })
//
root.child(`/coasters`).once('value', (coasters) => {
	let url = 'this is the new url';
	let updates = require('../functions/images.js').getImageUpdates(coasters.val(), url, uid);
	console.log(updates);
})
// root.child(`/user-coasters/${uid}`).once('value', (userCoasters) => {
// 	let url = 'this is the new url';
// 	let updates = require('../functions/images.js').getImageUpdates(userCoasters.val(), url, uid);
// 	console.log(updates);
// })
