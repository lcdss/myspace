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

type UserNewModalProps = {
  user?: User;
  open: boolean;
  onClose: () => void;
  onSubmit: OnSubmit<UserFormData>;
};

export default function UserNewModal({
  open,
  onClose,
  onSubmit,
}: UserNewModalProps) {
  return (
    <Dialog
      maxWidth="md"
      open={open}
      onClose={onClose}
      disableBackdropClick
      disableEscapeKeyDown
      aria-labelledby="add-new-user"
    >
      <DialogTitle id="add-new-user">Add User</DialogTitle>
      <DialogContent>
        <UserForm id="add-user-form" onSubmit={onSubmit} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" color="primary" form="add-user-form">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
