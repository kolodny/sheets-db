import React from 'react';
import { Button } from '@mui/material';
import { auth, signIn, useUser, signOut } from './firebase';

export const App: React.FunctionComponent = () => {
  const { user, loading } = useUser(auth);
  if (loading) return <div>Loading...</div>;
  return (
    <div>
      <Button variant="contained" onClick={user ? signOut : signIn}>
        Sign {user ? 'Out' : 'In'}
      </Button>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};
