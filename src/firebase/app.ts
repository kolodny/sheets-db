// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// import {signInWithRedirect, GoogleAuthProvider, getAuth } from 'firebase/auth';



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDx7-8hH5YoG-nTw9EGEjeC2Zok0ItgU2M",
  authDomain: "gsheets-db-service.firebaseapp.com",
  databaseURL: "https://gsheets-db-service-default-rtdb.firebaseio.com",
  projectId: "gsheets-db-service",
  storageBucket: "gsheets-db-service.appspot.com",
  messagingSenderId: "988509801158",
  appId: "1:988509801158:web:61f5800211351474c325c7",
  measurementId: "G-KXZQJ48DZV"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// const provider = new GoogleAuthProvider();
// // provider.addScope('profile');
// // provider.addScope('email');
// const auth = getAuth();
// export const foo = signInWithRedirect(auth, provider);
