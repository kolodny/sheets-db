import React from 'react';
import { Auth, User } from 'firebase/auth';

export const useUser = (auth: Auth) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error>();
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
      setUser(user);
    }, setError);
    return () => unsubscribe();
  }, [auth]);
  return { user, loading, error };
};
