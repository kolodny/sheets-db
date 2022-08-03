import React from 'react';
import { Button } from '@mui/material';
import {
  auth,
  signInRedirect,
  signIn,
  useUser,
  signOut,
  useDB,
} from './firebase';
import { getRedirectResult } from 'firebase/auth';

setTimeout(() => {
  getRedirectResult(auth).then(
    (r) => console.log({ r }),
    (e) => console.log({ e })
  );
}, 1000);

export const App: React.FunctionComponent = () => {
  const { user, loading } = useUser(auth);
  const db = useDB(`/users/${user?.uid}/data`, [!!user]);
  console.log(db);

  const userDir = useDB(`/users/${user?.uid}`, [!!user]);
  React.useEffect(() => {
    if (!user || userDir.value) return;
    userDir.setValue({
      email: user.email,
    });
  }, [user]);
  if (loading) return <div>Loading...</div>;

  const writeData = user && (
    <Button
      variant="outlined"
      onClick={() => {
        db.setValue({
          ok: Math.random(),
        });
      }}
    >
      Write Data
    </Button>
  );

  return (
    <div>
      <Button variant="contained" onClick={user ? signOut : signIn}>
        Sign {user ? 'Out' : 'In (popup)'}
      </Button>
      <Button variant="contained" onClick={user ? signOut : signInRedirect}>
        Sign {user ? 'Out' : 'In (redirect)'}
      </Button>
      {writeData}
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};
