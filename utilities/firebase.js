'use strict'
const admin = require("firebase-admin");
const env = process.env.NODE_ENV;
const development = require("./fBServiceAccountKey_admin_dev.json");
const production = require("./fBServiceAccountKey_admin.json");
const environment = process.env.NODE_ENV === 'production' ? production : development
const databaseURL = process.env.NODE_ENV === 'production' ? 'https://srb-coasters.firebaseio.com' : 'https://srb-coasters-dev.firebaseio.com'


admin.initializeApp({
  credential: admin.credential.cert(environment),
  databaseURL
});

console.log(`Firebase connection established to ${process.env.NODE_ENV ? process.env.NODE_ENV : 'development' } . . .`);

module.exports = admin;
