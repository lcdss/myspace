import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect, useCallback } from 'react';

import Layout from './components/Layout';
import UserList from './components/UserList';
import { User, UserFormData } from './types';
import UserNewModal from './components/UserNewModal';
import UserEditModal from './components/UserEditModal';
import { allUsers, createUser, updateUser, deleteUser } from './api';

const App = () => {
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User>();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleCloseAddForm = () => {
    setOpenAddForm(false);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setOpenEditForm(true);
  };

  const handleDelete = ({ id }: User) => {
    deleteUser({ id }).then(async () => {
      if (totalRows > rowsPerPage) {
        fetchUsers();
      } else {
        setTotalRows(totalRows - 1);
      }
    });
  };

  const handleAddFormSubmit = (formData: UserFormData) => {
    createUser(formData).then(({ data: { data } }) => {
      setUsers([data, ...users.slice(0, -1)]);
      setTotalRows(totalRows + 1);
      setOpenAddForm(false);
    });
  };

  const handleEditFormSubmit = (formData: UserFormData) => {
    if (!currentUser) {
      console.error("The currentUser shouldn't be undefined here.");
      return;
    }

    updateUser({ id: currentUser.id, formData }).then(
      ({ data: { data: updatedUser } }) => {
        const items = [...users].map(user =>
          user.id === updatedUser.id ? updatedUser : user,
        );

        setUsers(items);
        setCurrentUser(updatedUser);
        setOpenEditForm(false);
      },
    );
  };

  const fetchUsers = useCallback(() => {
    allUsers({ page: page + 1, perPage: rowsPerPage }).then(({ data }) => {
      setUsers(data.data);
      setTotalRows(data.meta.total);
      setPage(data.meta.current_page - 1);
      setRowsPerPage(+data.meta.per_page);
    });
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, page, rowsPerPage]);

  return (
    <Layout>
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
        items={users}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalRows}
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
    </Layout>
  );
};

export default App;
