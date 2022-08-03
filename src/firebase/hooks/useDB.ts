import React from 'react';
import { getDatabase, ref, set, onValue, get } from 'firebase/database';
import { User } from 'firebase/auth';

export const useDB = <T>(path: string, deps?: React.DependencyList) => {
  const [value, _setValue] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error>();
  const [isSetting, setIsSetting] = React.useState(false);
  const [settingError, setSettingError] = React.useState<Error>();
  const db = React.useMemo(() => getDatabase(), []);
  const dataRef = React.useMemo(() => ref(db, path), [db, path]);

  React.useEffect(() => {
    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        setError(undefined);
        setLoading(false);
        _setValue(snapshot.val());
      },
      (error) => {
        _setValue(null);
        setLoading(false);
        setError(error);
      }
    );
    return () => unsubscribe();
  }, [dataRef, ...(deps ?? [])]);

  const setValue = React.useCallback(
    (value: T) => {
      const setPromise = set(dataRef, value);
      const doneSetting = () => setIsSetting(false);
      setPromise.catch(setSettingError).finally(doneSetting);
    },
    [dataRef]
  );

  return { value, setValue, loading, error };
};
