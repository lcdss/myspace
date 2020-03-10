import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider } from 'easy-peasy';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { Router } from '@reach/router';

import App from './App';
import store from './store';
import theme from './theme';
import * as serviceWorker from './serviceWorker';

import GuestLayout from './components/layouts/Guest';
import DashboardLayout from './components/layouts/Dashboard';
import LoginPage from './pages/auth/Login';
import UsersPage from './pages/dashboard/Users';
import NotFoundPage from './pages/errors/NotFound';

ReactDOM.render(
  <StoreProvider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <App path="/">
          <DashboardLayout path="/">
            <UsersPage path="/" />
          </DashboardLayout>
          <GuestLayout path="auth">
            <LoginPage path="login" />
          </GuestLayout>
          <NotFoundPage default />
        </App>
      </Router>
    </ThemeProvider>
  </StoreProvider>,
  document.getElementById('root'),
);

serviceWorker.register();
