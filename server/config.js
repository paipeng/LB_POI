
var fs = require('fs');
var path = require('path');

// Replace with your unique name
exports.appName = 'js-server';

// Use your own Server Key as generated by Google Developer Console
// For more details, see http://developer.android.com/google/gcm/gs.html
exports.gcmServerApiKey = 'AIzaSyCPc_bdij7vgRdX7t1FQD7g7LFSY3le5gQ';

// You may want to use your own credentials here
exports.apnsCertData = readCredentialsFile('pushcert.pem');
exports.apnsKeyData =readCredentialsFile('key.pem');


//--- Helper functions ---

function readCredentialsFile(name) {
    return fs.readFileSync(
        path.resolve(__dirname, 'credentials', name),
        'UTF-8'
    );
}
