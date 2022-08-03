import React from 'react';
import { Button } from '@mui/material';
import { auth, signIn, useUser, signOut, useDB } from './firebase';

export const App: React.FunctionComponent = () => {
  const { user, loading } = useUser(auth);
  const db = useDB(`/users/${user?.uid}/data`, [!!user]);
  console.log(db);
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
        Sign {user ? 'Out' : 'In'}
      </Button>
      {writeData}
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};
