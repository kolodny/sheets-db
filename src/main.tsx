import './firebase/app';
import { getAuth, getRedirectResult } from 'firebase/auth';
import { signInRedirect } from './firebase';
import { ref, set, get, getDatabase } from 'firebase/database';

const params = new URLSearchParams(window.location.search);
const origin = params.get('origin');
if (origin) {
  getRedirectResult(getAuth()).then(async (userCredential) => {
    if (!userCredential) {
      signInRedirect();
      return;
    }
    let token: string;
    const { uid, email } = userCredential.user;
    try {
      const database = getDatabase();
      const dir = `users/${uid}`;
      const dirRef = ref(database, dir);
      const emailRef = ref(database, `${dir}/email`);
      const tokensRef = ref(database, `${dir}/tokens`);

      const exists = (await get(dirRef)).exists();
      if (!exists) {
        await set(emailRef, email);
      }
      const tokens = (await get(tokensRef)).val() ?? {};
      const foundEntry = Object.entries(tokens).find(
        ([, tokenOrigin]) => tokenOrigin === origin
      );
      if (foundEntry) {
        token = foundEntry[0];
      } else {
        token = crypto.randomUUID();
        const tokenRef = ref(database, `${dir}/tokens/${token}`);
        await set(tokenRef, origin);
      }
    } catch (error: any) {
      window.opener.postMessage(
        { type: 'error', errorMessage: error?.message },
        origin
      );
      return;
    }
    window.opener.postMessage({ type: 'login', token }, origin);
  });
} else {
  Promise.all([
    import('react'),
    import('react-dom/client'),
    import('./app'),
  ]).then(([React, ReactDOM, { App }]) => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
}
