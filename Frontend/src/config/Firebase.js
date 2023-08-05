import  firebase  from 'firebase/compat/app';
import {getFirestore} from 'firebase/firestore';
import { getAuth, GoogleAuthProvider  } from 'firebase/auth';

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
export const db = getFirestore(app);
export const auth = getAuth(app);
export  {app, provider};
export { firebase };
export default app;
