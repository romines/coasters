'use strict'
const admin = require("firebase-admin");
const serviceAccount = require("./fBServiceAccountKey_admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://srb-coasters-dev.firebaseio.com"
});

module.exports = admin.database();
