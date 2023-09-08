// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtkvuArht8c2AnAt_K7Gjd6Hvw9R3RrI4",
  authDomain: "kube-388718.firebaseapp.com",
  projectId: "kube-388718",
  storageBucket: "kube-388718.appspot.com",
  messagingSenderId: "184344491711",
  appId: "1:184344491711:web:ee86799cbe6f5ea644380a",
  measurementId: "G-ZL0SFDL6Z3",
  databaseURL:"https://kube-388718-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



