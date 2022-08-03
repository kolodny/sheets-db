import React from 'react';
import { Button } from '@mui/material';
import { auth, signIn, useUser, signOut } from './firebase';

(window as any).auth = auth;

export const App: React.FunctionComponent = () => {
  const user = useUser(auth);
  return (
    <div>
      <Button variant="contained" onClick={user ? signOut : signIn}>
        Sign {user ? 'Out' : 'In'}
      </Button>
      <pre>{JSON.stringify(auth, null, 2)}</pre>
    </div>
  );
};
