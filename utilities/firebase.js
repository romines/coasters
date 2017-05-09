'use strict'
const admin = require("firebase-admin");
const env = process.env.NODE_ENV;
const development = require("./fBServiceAccountKey_admin_dev.json");
const production = require("./fBServiceAccountKey_admin.json");
const environment = process.env.NODE_ENV === 'production' ? production : development

console.log(`. . . NODE_ENV is ${process.env.NODE_ENV} . . .`);

admin.initializeApp({
  credential: admin.credential.cert(environment),
  databaseURL: "https://srb-coasters-dev.firebaseio.com"
});

module.exports = admin.database();
