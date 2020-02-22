interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  avatar: string;
}

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

export interface UserFormData {
  name: string;
  email: string;
  cpf: string;
  avatar: FileList;
}
