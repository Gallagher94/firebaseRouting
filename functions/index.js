// The Cloud Functions for Firebase SDK to create Cloud Functions
// and setup triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");

admin.initializeApp();

function extractToken (req) {
  functions.logger.info(req.headers, {structuredData: true});

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.authorization) {
      return req.query.authorization;
  }
  return null;
}


exports.third = functions.https.onRequest(async (req, res) => {
  functions.logger.info(req, {structuredData: true});
  functions.logger.info(res, {structuredData: true});
  res.set('Access-Control-Allow-Origin', 'https://fir-linkedinrouter.web.app');
  res.set('Access-Control-Allow-Headers', 'authorization');

  return res.status(200).send('Hello Jordan');
});

exports.second = functions.https.onRequest(async (req, res) => {
  
  res.set('Access-Control-Allow-Origin', 'https://fir-linkedinrouter.web.app'); // Your origin here
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Authorization, authorization');

   // A 204 response (preflight response) happens before actually trying to respond, so accept the auth header and send an OK
   if (req.method === 'OPTIONS') {
    res.status(204).send('');
} else {

    functions.logger.info(res.headers, {structuredData: true});
    functions.logger.info(req.headers, {structuredData: true});
    functions.logger.info(req.method, {structuredData: true});


  const idToken = extractToken(req);
  let uid  = 'NA';
  let userID  = 'NA';
  let claim  = 'NA';

  admin
  .auth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    uid = decodedToken.uid;
    claim = decodedToken.special;
    userID = decodedToken;

    functions.logger.info({uid}, {structuredData: true});
    functions.logger.info({idToken}, {structuredData: true});
    functions.logger.info({claim}, {structuredData: true});
    functions.logger.info({userID}, {structuredData: true});

    res.json({result: req.method, token:userID, claim:claim, uid:uid});
    process.exit();

  })
  .catch((error) => {
    functions.logger.info(error, {structuredData: true});
    res.status(501).send()
    process.exit(1);

  });
}
})

exports.helloWorld = functions.https.onCall((data, context) => {
  functions.logger.info(data, {structuredData: true});

  functions.logger.info({context}, {structuredData: true});
  if (context.auth && context.auth.token.special) {
    console.log('you HAVE it');
    console.log('the data was', {data})
    return {success: true};
  } else {
    console.log('DONT HAVE IT');
    return {bad: true}
  }
});

// exports.newUser = functions.auth.user().onCreate(user => {
//   console.log('new user added', user);

//   admin.auth().setCustomUserClaims(user.uid, {special: true}).then(e => {
//     console.log('it was successful');
//     process.exit();
//   }).catch((e) => {
//     console.error('it failed', e);
//     process.exit(1);
//   });
// })

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'https://fir-linkedinrouter.web.app',
  methods: ["GET, POST, OPTIONS"],
  allowedHeaders: 'Authorization, authorization',
  exposedHeaders: ['Authorization, authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
}));

 
app.get('/test', (req, res) => {
  functions.logger.info(req, { structuredData: true });
  functions.logger.info(req.headers, { structuredData: true });
  const idToken = extractToken(req);
  res.status(200).json({result:'This is CORS-enabled for all origins!!'});
  return process.exit();
});

app.get('/register', (req, res) => {
  const idToken = extractToken(req);
  // res.status(200).json({result:'This is CORS-enabled for all origins!!'});
  // return process.exit();

  admin
  .auth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
  
    let uid = decodedToken.uid;

    functions.logger.info({decodedToken}, {structuredData: true});

    admin.auth().setCustomUserClaims(uid, {admin: true}).then(e => {
        res.status(200).json({result:"sucess"});
        return process.exit();
    }).catch((e) => {
      functions.logger.info('nah it was bad', {structuredData: true});
      functions.logger.info({e}, {structuredData: true});

        res.status(501).send({result:"failed to set Custom claim"})
        return process.exit(1);
    });
  })
  .catch((error) => {
    functions.logger.info(error, {structuredData: true});
    res.status(501).json({result: "failed To Verify Token"})
    return process.exit(1);
  });
});

exports.expressApp = functions.https.onRequest(app);
// https://us-central1-<project-id>.cloudfunctions.net/expressApp/test