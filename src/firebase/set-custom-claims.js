var admin = require('firebase-admin');

var serviceAccount = require('../../fir-linkedinrouter-firebase-adminsdk-6bkpd-7de7149686.json');

var uid = process.argv[2];

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-linkedinrouter-default-rtdb.firebaseio.com"
});

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('custom claims set for user', uid);
    process.exit()
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  })
