'use strict'
const admin = require("firebase-admin");
const environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

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
  databaseURL: databaseURL[environment]
});

console.log(`Firebase connection established to0000 ${environment} . . .`);
// console.log(`Firebase connection established to ${process.env.NODE_ENV ? process.env.NODE_ENV : 'development' } . . .`);

module.exports = admin;
