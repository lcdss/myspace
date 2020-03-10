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

export type UserFormData = Omit<User, 'id' | 'avatar'> & {
  password?: string;
  avatar: FileList;
};

const uploadAvatar = ({ id, file }: { id: number; file: File }) => {
  const formData = new FormData();

  formData.append('avatar', file);

  return http.post<UserResponse>(`users/${id}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const fetchAll = ({ page = 0, perPage = 10 }) => {
  return http.get<UsersResponse>('users', {
    params: { page, perPage },
  });
};

export const create = async ({ cpf, avatar, ...others }: UserFormData) => {
  const file = avatar.item(0);
  const createPromise = http.post<UserResponse>('users', {
    ...others,
    cpf: formatCpf(cpf),
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

export const destroy = ({ id }: { id: number }) => {
  return http.delete(`users/${id}`);
};

export const available = ({ value }: { value: string }) => {
  return http.get<UserAvailableResponse>('users/available', {
    params: { value },
  });
};
