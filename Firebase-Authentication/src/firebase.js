import firebase from 'firebase/compat/app';
import { getAuth } from 'firebase/auth';

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

export const auth = getAuth(app);
export default app;