import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  appId: process.env.REACT_APP_APPID,
  // databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
});
console.log(firebase.app().options);

export const firestore = firebase.firestore();
export const storage = firebase.storage();
export const auth = firebase.auth();
export const timeStamp = firebase.firestore.FieldValue.serverTimestamp

