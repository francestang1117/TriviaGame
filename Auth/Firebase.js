const  firebase = require ('firebase/compat/app');
const {getFirestore} = require('firebase/firestore');
const { getAuth, GoogleAuthProvider  } = require('firebase/auth');

const firebaseConfig = {
    apiKey: "AIzaSyCp1L_lxmJ0UF3QkeJkH04fEt535I6P-VY",
    authDomain: "serverless-8dce3.firebaseapp.com",
    projectId: "serverless-8dce3",
    storageBucket: "serverless-8dce3.appspot.com",
    messagingSenderId: "829993559820",
    appId: "1:829993559820:web:73ee8279f585dca5a5cb29",
    measurementId: "G-CWX3KZVDS8"
};

const app = firebase.initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const auth = getAuth(app);

module.exports = {app, provider, firebase, db, auth};