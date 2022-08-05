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
  const userCredential = await getRedirectResult(getAuth());
  if (userCredential) {
    const token = params.get('token');
    window.opener.postMessage({ type: 'login', token }, origin);
  } else {
    const token = crypto.randomUUID();
    // Google will redirect back with the URL token param.
    history.pushState(null, '', `${location.search}&token=${token}`);
    signInRedirect();
  }
} else {
  const React = await import('react');
  const ReactDOM = await import('react-dom/client');
  const { App } = await import('./app');

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
