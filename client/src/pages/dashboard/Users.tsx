import { RouteComponentProps } from '@reach/router';
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactElement,
} from 'react';

import UserList from '../../components/UserList';
import { UserFormData } from '../../services/users';
import UserNewModal from '../../components/UserNewModal';
import { useStoreActions, useStoreState } from '../../hooks/index';

type UsersPageProps = (props: RouteComponentProps) => ReactElement;

const UsersPage: UsersPageProps = () => {
  const [openAddForm, setOpenAddForm] = useState(false);
  const { pagination } = useStoreState(state => state.users);

  const { fetchItems, create, setPagination } = useStoreActions(
    actions => actions.users,
  );

  const handleCloseAddForm = () => setOpenAddForm(false);

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setPagination({ ...pagination, page: 0, perPage: newRowsPerPage });
  };

  const handleAddFormSubmit = (formData: UserFormData) => {
    create(formData)
      .then(() => setOpenAddForm(false))
      .catch((error: any) =>
        console.error('Error while creating a new user', error),
      );
  };

  const renderUserList = useMemo(
    () => (
      <UserList
        onAddClick={() => setOpenAddForm(true)}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    ),
    [],
  );

  const fetchUsers = useCallback(() => {
    fetchItems({ page: pagination.page + 1, perPage: pagination.perPage })
      .then(() => console.log('Users fetched'))
      .catch((error: any) => console.error('Fetching users failed', error));
  }, [fetchItems, pagination.page, pagination.perPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      {renderUserList}

      <UserNewModal
        open={openAddForm}
        onClose={handleCloseAddForm}
        onSubmit={handleAddFormSubmit}
      />
    </>
  );
};

export default UsersPage;
