import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  signInWithRedirect,
} from 'firebase/auth';

const provider = new GoogleAuthProvider();
provider.addScope('email');
export const auth = getAuth();
export const signIn = () => signInWithPopup(auth, provider);
export const signInRedirect = () => signInWithRedirect(auth, provider);
export const signOut = () => auth.signOut();
