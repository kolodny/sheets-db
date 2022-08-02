// Import the functions you need from the SDKs you need

import {signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth';


const provider = new GoogleAuthProvider();
provider.addScope('email');
const auth = getAuth();
export const foo = signInWithPopup(auth, provider);
