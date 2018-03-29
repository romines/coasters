/* eslint-env node */
// TODO: add Twilio Credentials to environment variable
const config = require('./twilioConfig.js');

// require the Twilio module and create a REST client
const client = require('twilio')(config.sid, config.token);

module.exports = function (to, message, recipient) {

  var PhoneNumber = require( 'awesome-phonenumber' );
  var pn = new PhoneNumber( to, 'US' );
  if (!pn.isValid()) {
    console.log('Cannot send SMS. Invalid number');
    return;
  }

  console.log(`Sending text notification to ${recipient}: ${to}`);

  client.messages.create(
    {
      to: pn.getNumber( 'international' ),
      from: '+13073171145',
      body: message,
    },
    (err, message) => {
      err && console.log(err, message);
    }
  );
}
