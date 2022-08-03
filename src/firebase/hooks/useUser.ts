import React from 'react';
import { Auth, User } from 'firebase/auth';

export const useUser = (auth: Auth) => {
  const [user, setUser] = React.useState<User | null>(null);
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);
  return user;
};
