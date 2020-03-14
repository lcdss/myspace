import { Action, action, Thunk, thunk } from 'easy-peasy';
import {
  fetchAll,
  create,
  update,
  destroy,
  UserFormData,
} from '../services/users';

interface Pagination {
  page: number;
  perPage: number;
  total: number;
}

export interface User {
  id: number;
  name: string;
  cpf: string;
  email: string;
  avatar: string;
  points: number;
  createdAt: string;
}

export interface UsersModel {
  loading: boolean;
  items: User[];
  pagination: Pagination;
  setItems: Action<UsersModel, User[]>;
  setLoading: Action<UsersModel, boolean>;
  setPagination: Action<UsersModel, Pagination>;
  add: Action<UsersModel, User>;
  edit: Action<UsersModel, User>;
  remove: Action<UsersModel, number>;
  fetchItems: Thunk<
    UsersModel,
    {
      page?: number;
      perPage?: number;
      search?: string;
      filter?: { [K in keyof User]?: string };
    }
  >;
  create: Thunk<UsersModel, UserFormData>;
  update: Thunk<UsersModel, { id: number; formData: UserFormData }>;
  destroy: Thunk<UsersModel, { id: number }>;
}

const usersModel: UsersModel = {
  loading: false,
  items: [],
  pagination: {
    page: 0,
    perPage: 10,
    total: 0,
  },
  setItems: action((state, users) => {
    state.items = users;
  }),
  setLoading: action((state, loading) => {
    state.loading = loading;
  }),
  setPagination: action((state, pagination) => {
    state.pagination = pagination;
  }),
  add: action((state, user) => {
    const { total, perPage } = state.pagination;
    const endIndex = total < perPage ? total : -1;

    state.items = [user, ...state.items.slice(0, endIndex)];
    state.pagination.total += 1;
  }),
  edit: action((state, user) => {
    const index = state.items.findIndex(item => item.id === user.id);
    state.items[index] = user;
  }),
  remove: action((state, id) => {
    const index = state.items.findIndex(item => item.id === id);
    state.items.splice(index, 1);
  }),
  fetchItems: thunk(async (actions, params) => {
    actions.setLoading(true);

    try {
      const {
        data: { meta, data: users },
      } = await fetchAll(params);
      const { current_page: page, per_page: perPage, total } = meta;

      actions.setPagination({
        page: page - 1,
        perPage: Number(perPage),
        total,
      });
      actions.setItems(users);
      actions.setLoading(false);
    } catch (error) {
      actions.setLoading(false);
      throw new Error(error);
    }
  }),
  create: thunk(async (actions, formData) => {
    try {
      const {
        data: { data: user },
      } = await create(formData);

      actions.add(user);
    } catch (error) {
      throw new Error(error);
    }
  }),
  update: thunk(async (actions, { id, formData }) => {
    try {
      const {
        data: { data: user },
      } = await update({ id, formData });

      actions.edit(user);
    } catch (error) {
      throw new Error(error);
    }
  }),
  destroy: thunk(async (actions, { id }) => {
    try {
      await destroy({ id });

      actions.remove(id);
    } catch (error) {
      throw new Error(error);
    }
  }),
};

export default usersModel;
