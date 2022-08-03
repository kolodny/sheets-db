import './firebase/app';
import { getAuth, getRedirectResult } from 'firebase/auth';

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

getRedirectResult(getAuth()).then(async (userCredential) => {
  if (userCredential) {
    // Do some DB stuff
    close();
    return;
  }
  const React = await import('react');
  const ReactDOM = await import('react-dom/client');
  const { App } = await import('./app');

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
