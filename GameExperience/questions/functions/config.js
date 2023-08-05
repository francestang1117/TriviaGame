import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbPoVqjk45k9dUuwR-wqA9Vn0MOw091co",
  authDomain: "csci-5410-s23-sdp1.firebaseapp.com",
  projectId: "csci-5410-s23-sdp1",
  storageBucket: "csci-5410-s23-sdp1.appspot.com",
  messagingSenderId: "1042986359769",
  appId: "1:1042986359769:web:f1c115695937729ffd17c8",
  measurementId: "G-R5SF73YP7N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }
 