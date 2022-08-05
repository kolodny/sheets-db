const TOKEN_KEY = 'SHEETS_TOKEN_KEY';
export const getToken = () => window.localStorage.getItem(TOKEN_KEY);
export const signIn = async () => {
  const existingToken = getToken();
  if (existingToken) {
    return existingToken;
  }
  let interval: ReturnType<typeof setInterval>;
  let opened: Window | null;
  return new Promise((resolve, reject) => {
    const appOrigin = 'https://app-g-sheets.web.app';
    const loginUrl = `${appOrigin}?origin=${location.origin}`;
    const width = 500;
    const height = 600;

    const left = screen.availWidth / 2 - width / 2;
    const top = screen.availHeight / 2 - height / 2;

    const onMessage = (event: MessageEvent) => {
      const { data, origin } = event;
      if (origin !== appOrigin) {
        return;
      }
      const { type, token } = data ?? {};
      if (type === 'login' && token) {
        window.localStorage.setItem(TOKEN_KEY, token);
        window.removeEventListener('message', onMessage);
        resolve(token);
      }
      if (type === 'error') {
        reject(new Error(data?.errorMessage));
      }
    };

    window.addEventListener('message', onMessage);

    opened = window.open(
      loginUrl,
      '_blank',
      `left=${left},top=${top},width=${width},height=${height}`
    );
    interval = setInterval(() => {
      if (opened?.closed) {
        reject(new Error('Login cancelled'));
      }
    }, 1000);
  }).finally(() => {
    clearInterval(interval);
    opened?.close();
    opened = null;
  });
};
