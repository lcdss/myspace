import React from 'react';
import { OnSubmit } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import UserForm from './UserForm';
import { User } from '../model/users';
import { UserFormData } from '../services/users';

type UserEditModalProps = {
  user: User;
  open: boolean;
  onClose: () => void;
  onSubmit: OnSubmit<UserFormData>;
};

export default function UserEditModal({
  user,
  open,
  onClose,
  onSubmit,
}: UserEditModalProps) {
  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={onClose}
      disableBackdropClick
      disableEscapeKeyDown
      aria-labelledby="edit-user"
    >
      <DialogTitle id="edit-user">Edit User</DialogTitle>
      <DialogContent>
        <UserForm id="edit-user-form" user={user} onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" color="primary" form="edit-user-form">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
