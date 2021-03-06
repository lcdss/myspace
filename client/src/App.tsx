import React, { useEffect, useState, ReactNode } from 'react';
import { navigate, useMatch, RouteComponentProps } from '@reach/router';
import { useStoreActions } from './hooks';

interface AppProps extends RouteComponentProps {
  children: ReactNode;
}

const App = ({ children }: AppProps) => {
  const [loading, setLoading] = useState(true);
  const loadAuth = useStoreActions(actions => actions.auth.loadAuth);
  const matchAuth = useMatch('auth/*');

  useEffect(() => {
    loadAuth()
      .then(() => {
        if (matchAuth) {
          navigate('/');
        }
      })
      .catch((error: any) => {
        if (!matchAuth) {
          navigate('/auth/login');
        }

        console.info('Please login before accessing the dashboard', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [loadAuth]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
};

export default App;
