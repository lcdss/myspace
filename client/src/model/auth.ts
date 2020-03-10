import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy';

import { User } from './users';
import { login, logout, fetchMe, LoginData } from '../services/auth';

export interface AuthModel {
  user: User;
  token: string;
  isAuthenticated: Computed<AuthModel, boolean>;
  setToken: Action<AuthModel, string>;
  setUser: Action<AuthModel, User>;
  login: Thunk<AuthModel, LoginData>;
  logout: Thunk<AuthModel>;
  loadAuth: Thunk<AuthModel>;
}

const userStub = {
  id: 0,
  name: '',
  email: '',
  cpf: '',
  avatar: '',
};

const authModel: AuthModel = {
  user: userStub,
  token: window.localStorage.getItem('token') || '',
  isAuthenticated: computed(state => {
    return state.token.length > 0 && state.user.id !== 0;
  }),
  setToken: action((state, token) => {
    if (token) {
      window.localStorage.setItem('token', token);
    } else {
      window.localStorage.removeItem('token');
    }

    state.token = token;
  }),
  setUser: action((state, user) => {
    state.user = user;
  }),
  login: thunk(async (actions, credentials) => {
    try {
      const {
        data: {
          data: { accessToken },
        },
      } = await login(credentials);

      actions.setToken(accessToken);
    } catch (error) {
      throw new Error(error);
    }
  }),
  logout: thunk(async actions => {
    try {
      await logout();

      actions.setToken('');
      actions.setUser(userStub);
    } catch (error) {
      throw new Error(error);
    }
  }),
  loadAuth: thunk(async actions => {
    try {
      const {
        data: { data: user },
      } = await fetchMe();

      actions.setUser(user);
    } catch (error) {
      actions.setToken('');
      actions.setUser(userStub);

      throw new Error(error);
    }
  }),
};

export default authModel;
