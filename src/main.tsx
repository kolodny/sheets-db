import './firebase/app';
import { getAuth, getRedirectResult } from 'firebase/auth';

getRedirectResult(getAuth()).then(async (userCredential) => {
  if (userCredential) {
    // Do some DB stuff
    window.close();
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
