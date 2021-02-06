const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


// Cut off time. Child nodes older than this will be deleted.

/**
 * This database triggered function will check for child nodes that are older than the
 * cut-off time. Each child needs to have a `timestamp` attribute.
 */

  exports.timerUpdate = functions.pubsub.schedule('* * * * *').onRun((context) => {

    admin.firestore().collection("videos").doc().add({
      timeAgo: timeAgo + "1"
    });
    return console.log('successful timer update');
  });
