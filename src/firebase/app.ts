import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDxI-4STq4kZdo-xGlCL5qEXt6bstnUBy4',
  authDomain: 'app-g-sheets.firebaseapp.com',
  projectId: 'app-g-sheets',
  storageBucket: 'app-g-sheets.appspot.com',
  messagingSenderId: '721134805434',
  appId: '1:721134805434:web:d4306953594fc627cc7d83',
  measurementId: 'G-H05G2BY6FL',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
