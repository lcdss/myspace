import authModel, { AuthModel } from './auth';
import usersModel, { UsersModel } from './users';

export interface StoreModel {
  auth: AuthModel;
  users: UsersModel;
}

const storeModel: StoreModel = {
  auth: authModel,
  users: usersModel,
};

export default storeModel;
