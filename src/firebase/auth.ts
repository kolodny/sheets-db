import { signInWithPopup, GoogleAuthProvider, getAuth } from 'firebase/auth';

const provider = new GoogleAuthProvider();
provider.addScope('email');
export const auth = getAuth();
export const signIn = () => signInWithPopup(auth, provider);
export const signOut = () => auth.signOut();
