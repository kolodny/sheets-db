import './firebase/app';
import { getAuth, getRedirectResult } from 'firebase/auth';
import { signInRedirect } from './firebase';
import { ref, set, getDatabase } from 'firebase/database';

const params = new URLSearchParams(window.location.search);
const origin = params.get('origin');
if (origin) {
  getRedirectResult(getAuth()).then(async (userCredential) => {
    if (userCredential) {
      const token = params.get('token');
      const { uid, email } = userCredential.user;
      try {
        await set(ref(getDatabase(), `/users/${uid}`), {
          email,
          data: {
            token,
          },
        });
      } catch (error: any) {
        window.opener.postMessage(
          { type: 'error', errorMessage: error?.message },
          origin
        );
        return;
      }
      window.opener.postMessage({ type: 'login', token }, origin);
    } else {
      const token = crypto.randomUUID();
      // Google will redirect back with the URL token param.
      history.pushState(null, '', `${location.search}&token=${token}`);
      signInRedirect();
    }
  });
} else {
  const imports = Promise.all([
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
