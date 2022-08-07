import React from 'react';
import { Button } from '@mui/material';
import { auth, signIn as fbSignIn, useUser, signOut, useDB } from './firebase';
import { signIn, getData, setData } from './sdk';

(window as any).setData = setData;
(window as any).getData = getData;

export const App: React.FunctionComponent = () => {
  const { user, loading } = useUser(auth);
  const db = useDB(`/users/${user?.uid}/data`, [!!user]);

  const userDir = useDB(`/users/${user?.uid}`, [!!user]);
  React.useEffect(() => {
    if (!user) return;
    if (userDir.loading) return;
    if (userDir.error) return;
    if (userDir.value) return;
    userDir.setValue({
      email: user.email,
    });
  }, [user, userDir.loading, userDir.value]);

  if (loading) return <div>Loading...</div>;

  const writeData = user && (
    <Button
      variant="outlined"
      style={{ marginLeft: 8 }}
      onClick={() => {
        db.setValue({
          ...db.value,
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
        Sign {user ? 'Out' : 'In (SDK DEMO)'}
      </Button>
      <Button
        style={{ marginLeft: 8 }}
        variant="contained"
        onClick={user ? signOut : fbSignIn}
      >
        Sign {user ? 'Out' : 'In (popup actual app)'}
      </Button>
      {writeData}
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};
