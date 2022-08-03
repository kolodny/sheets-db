import React from 'react';
import { Auth, User } from 'firebase/auth';

export const useUser = (auth: Auth) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false);
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);
  return { user, loading };
};
