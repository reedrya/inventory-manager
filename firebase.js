// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB30tyVjewpj_2sBPnaPL2mDL7GBRgHEiY",
  authDomain: "pantry-tracker-467e3.firebaseapp.com",
  projectId: "pantry-tracker-467e3",
  storageBucket: "pantry-tracker-467e3.appspot.com",
  messagingSenderId: "54765143160",
  appId: "1:54765143160:web:a537322e6f07dd30dd598d",
  measurementId: "G-1S3HNXXES1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};