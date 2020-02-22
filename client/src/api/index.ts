import { AxiosResponse } from 'axios';

import {
  UserResponse,
  UsersResponse,
  UserAvailableResponse,
  UserFormData,
} from '../types';
import http from '../services/http';
import { formatCpf } from '../utils';

const uploadAvatar = ({ id, file }: { id: number; file: File }) => {
  const formData = new FormData();

  formData.append('avatar', file);

  return http.post<UserResponse>(`users/${id}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const allUsers = ({ page = 0, perPage = 10 }) => {
  return http.get<UsersResponse>('users', {
    params: { page, perPage },
  });
};

export const createUser = async ({
  name,
  email,
  cpf,
  avatar,
}: UserFormData) => {
  const file = avatar.item(0);
  const createPromise = http.post<UserResponse>('users', {
    name,
    email,
    cpf: formatCpf(cpf),
  });

  if (!file) {
    return createPromise;
  }

  const {
    data: {
      data: { id },
    },
  }: AxiosResponse<UserResponse> = await createPromise;

  return uploadAvatar({ id, file });
};

export const updateUser = async ({
  id,
  formData: { name, email, cpf, avatar },
}: {
  id: number;
  formData: UserFormData;
}) => {
  const file = avatar.item(0);
  const updatePromise = http.patch<UserResponse>(`users/${id}`, {
    name,
    email,
    cpf: formatCpf(cpf),
  });

  if (!file) {
    return updatePromise;
  }

  await updatePromise;

  return uploadAvatar({ id, file });
};

export const deleteUser = ({ id }: { id: number }) => {
  return http.delete(`users/${id}`);
};

export const userAvailable = ({ value }: { value: string }) => {
  return http.get<UserAvailableResponse>('users/available', {
    params: { value },
  });
};
