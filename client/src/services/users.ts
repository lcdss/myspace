import qs from 'qs';

import { Links, Meta } from '../types';
import http from '../services/http';
import { formatCpf } from '../utils';
import { User } from '../model/users';

export interface UsersResponse {
  data: User[];
  links: Links;
  meta: Meta;
}

export interface UserResponse {
  data: User;
}

export interface UserAvailableResponse {
  available: boolean;
}

export type UserFormData = Partial<
  Omit<User, 'id' | 'avatar' | 'createdAt'>
> & {
  avatar?: FileList;
  password?: string;
};

const uploadAvatar = ({ id, file }: { id: number; file: File }) => {
  const formData = new FormData();

  formData.append('avatar', file);

  return http.post<UserResponse>(`users/${id}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const fetchAll = ({ page = 0, perPage = 10, ...rest }) => {
  return http.get<UsersResponse>('users', {
    params: { page, perPage, ...rest },
    paramsSerializer: params => {
      return qs.stringify(params);
    },
  });
};

export const create = async ({ cpf, avatar, ...others }: UserFormData) => {
  const file = avatar?.item(0);
  const createPromise = http.post<UserResponse>('users', {
    ...others,
    ...(cpf ? { cpf: formatCpf(cpf) } : {}),
  });

  if (!file) {
    return createPromise;
  }

  const {
    data: {
      data: { id },
    },
  } = await createPromise;

  return uploadAvatar({ id, file });
};

export const update = async ({
  id,
  formData: { cpf, avatar, ...others },
}: {
  id: number;
  formData: UserFormData;
}) => {
  const file = avatar?.item(0);
  const updatePromise = http.patch<UserResponse>(`users/${id}`, {
    ...(cpf ? { cpf: formatCpf(cpf) } : {}),
    ...others,
  });

  if (!file) {
    return updatePromise;
  }

  await updatePromise;

  return uploadAvatar({ id, file });
};

export const destroy = ({ id }: { id: number }) => {
  return http.delete(`users/${id}`);
};

export const available = ({ value }: { value: string }) => {
  return http.get<UserAvailableResponse>('users/available', {
    params: { value },
  });
};
