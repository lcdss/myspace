import { RouteComponentProps } from '@reach/router';
import React, { useState, useEffect, useCallback } from 'react';

import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import UserList from '../../components/UserList';
import { UserFormData } from '../../services/users';
import { User } from '../../model/users';
import UserNewModal from '../../components/UserNewModal';
import UserEditModal from '../../components/UserEditModal';
import { useStoreActions, useStoreState } from '../../hooks/index';

const UsersPage: React.FC<RouteComponentProps> = () => {
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const { items, currentUser, pagination } = useStoreState(
    state => state.users,
  );

  const {
    fetchItems,
    create,
    update,
    destroy,
    setCurrentUser,
    setPagination,
  } = useStoreActions(actions => actions.users);

  const handleCloseAddForm = () => setOpenAddForm(false);
  const handleCloseEditForm = () => setOpenEditForm(false);

  const handlePageChange = (newPage: number) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setPagination({ ...pagination, page: 0, perPage: newRowsPerPage });
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setOpenEditForm(true);
  };

  const handleDelete = ({ id }: User) => {
    destroy({ id })
      .then(() => fetchUsers())
      .catch((error: any) =>
        console.error('Error while deleting a user', error),
      );
  };

  const handleAddFormSubmit = (formData: UserFormData) => {
    create(formData)
      .then(() => setOpenAddForm(false))
      .catch((error: any) =>
        console.error('Error while creating a new user', error),
      );
  };

  const handleEditFormSubmit = (formData: UserFormData) => {
    if (!currentUser) {
      console.error("The currentUser shouldn't be undefined here");
      return;
    }

    update({ id: currentUser.id, formData })
      .then(() => setOpenEditForm(false))
      .catch((error: any) =>
        console.error('Error while updating a user', error),
      );
  };

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
      <Box display="flex" justifyContent="space-between" pb={3}>
        <Typography variant="h6">Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddForm(true)}
        >
          Add
        </Button>
      </Box>

      <UserList
        items={items}
        page={pagination.page}
        rowsPerPage={pagination.perPage}
        totalRows={pagination.total}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <UserNewModal
        open={openAddForm}
        onClose={handleCloseAddForm}
        onSubmit={handleAddFormSubmit}
      />
      {currentUser && (
        <UserEditModal
          user={currentUser}
          open={openEditForm}
          onClose={handleCloseEditForm}
          onSubmit={handleEditFormSubmit}
        />
      )}
    </>
  );
};

export default UsersPage;
