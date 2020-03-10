import http from './http';
import { User } from '../model/users';

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
  };
}

export interface UserResponse {
  data: User;
}

export const login = (data: LoginData) => {
  return http.post<LoginResponse>('auth/login', data);
};

export const refreshToken = () => {
  return http.post<LoginResponse>('auth/refresh');
};

export const logout = () => {
  return http.post('auth/logout');
};

export const fetchMe = () => {
  return http.get<UserResponse>('auth/me');
};
