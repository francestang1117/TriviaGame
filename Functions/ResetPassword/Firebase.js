const  firebase = require ('firebase/compat/app');
const {getFirestore} = require('firebase/firestore');
const { getAuth, GoogleAuthProvider  } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyB2ylpcs8AHxjB1a3M-QpSQ6IqQ9-WV_lg",
  authDomain: "serverless-e0a48.firebaseapp.com",
  projectId: "serverless-e0a48",
  storageBucket: "serverless-e0a48.appspot.com",
  messagingSenderId: "64948577651",
  appId: "1:64948577651:web:c999b30a987c713d4ad106",
  measurementId: "G-RW5LT1VS3H"
}

const app = firebase.initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const auth = getAuth(app);

module.exports = {app, provider, firebase, db, auth};