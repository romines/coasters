/* eslint-env node */
'use strict'
const credentials = require('./credentials.js');
const admin = require("firebase-admin");
admin.initializeApp(credentials);
admin.database().ref('data').on('child_changed', (refData) => {
  console.log('there was a change to data . . .');
})
const environment = 'production';

const serviceAccountKey = {
  development : require("./fBServiceAccountKey_admin_dev.json"),
  staging : require("./fBServiceAccountKey_admin_staging.json"),
  production : require("./fBServiceAccountKey_admin.json")
};
const databaseURL = {
  development : 'https://srb-coasters-dev.firebaseio.com',
  staging : 'https://srb-coasters-staging.firebaseio.com',
  production : 'https://srb-coasters.firebaseio.com'
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey[environment]),
  databaseURL: databaseURL[environment],
  storageBucket: "srb-coasters.appspot.com"
});

console.log(`Firebase connection established to ${environment} . . .`);

const db = admin.database();
const root = db.ref('data')
root.child(`/coasters`).on('child_changed', (refData) => {
  console.log('tDH says: there was a change to a coaster . . .');
})

process.on('exit', function(code) {
  return console.log(`tDH exiting with code ${code}`);
});