import './firebase/app';
import { getAuth, getRedirectResult } from 'firebase/auth';
import { signInRedirect } from './firebase';

const open = () => {
  const width = 500;
  const height = 600;

  const left = screen.availWidth / 2 - width / 2;
  const top = screen.availHeight / 2 - height / 2;

  const opened = window.open(
    'http://localhost:5173/',
    '_blank',
    `left=${left},top=${top},width=${width},height=${height}`
  );
};

(window as any).open2 = open;

const params = new URLSearchParams(window.location.search);
const origin = params.get('origin');
if (origin) {
  getRedirectResult(getAuth()).then(async (userCredential) => {
    if (userCredential) {
      const token = params.get('token');
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
