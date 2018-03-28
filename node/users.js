/* eslint-env node */
'use strict'

const admin = require("firebase-admin");
const escapeRegExp = require('lodash.escaperegexp');
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
const storage = admin.storage();
const signedUrlConfig = {
  action: 'read',
  expires: '03-17-2025'
};

// Module scope
let usersFromDb;
let usersWithUnscaledPhotoUrl;
let userUpdates;
let rootDataAsString;

process.on('exit', function(code) {
  return console.log(`Exiting with code ${code}`);
});

getData().then(snap => {
  rootDataAsString = JSON.stringify(snap.val())
  return Promise.resolve();
})
.then(getUsersFromDb)
.then(snap => {

  usersFromDb = snap.val()
  usersWithUnscaledPhotoUrl = Object.keys(usersFromDb).filter((userKey) => {
    return !!usersFromDb[userKey].photoURL && (usersFromDb[userKey].photoURL.indexOf('usr_') === -1)
  })

  usersWithUnscaledPhotoUrl.forEach(userKey => {
    const user = usersFromDb[userKey];
    console.log(occurrences(rootDataAsString, user.photoURL));
  })
  return Promise.resolve()
}).then(() => {
  return storage.bucket('srb-coasters.appspot.com').getFiles()
}).then((results) => {

  const files = results[0]

  return Promise.all(usersWithUnscaledPhotoUrl.map((userKey) => {
    const file = files.find((file) => {
      return (file.name.indexOf(userKey) > -1) && (file.name.indexOf('usr_') > -1);
    })
    if (file) {
      console.log(file.metadata.timeCreated.split('T')[0]);
      return Promise.all([userKey, file.getSignedUrl(signedUrlConfig)])
    } else {
      return Promise.resolve('No scaled image found')
    }

  }))
}).then((results) => {

  console.log('Scaled images found for ' + results.length + ' users');

  results.forEach(([userKey, result]) => {
    const user = usersFromDb[userKey];
    const re = new RegExp(escapeRegExp(user.photoURL), 'g');
    rootDataAsString = rootDataAsString.replace(re, result)
    console.log(occurrences(rootDataAsString, user.photoURL));
  })
  return Promise.resolve(0)

}).then((processCode) => {
  process.exit(processCode)
}, err => console.error(err))



function getUsersFromDb() {
  return root.child('users').once('value')
}
function getData() {
  return root.once('value')
}

function occurrences(string, subString, allowOverlapping) {
  // source: http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240

  string += "";
  subString += "";
  if (subString.length <= 0) return (string.length + 1);

  var n = 0,
    pos = 0,
    step = allowOverlapping ? 1 : subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else break;
  }
  return n;
}