import React from 'react';
import { useForm, OnSubmit } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import { isCpf } from '../utils';
import { userAvailable } from '../api';
import AvatarField from './AvatarField';
import { User, UserFormData } from '../types';

interface UserFormProps {
  id: string;
  user?: User;
  onSubmit: OnSubmit<UserFormData>;
}

const useStyles = makeStyles(theme => ({
  textField: {
    marginTop: theme.spacing(3),
  },
}));

const UserForm: React.FC<UserFormProps> = ({ id, user, onSubmit }) => {
  const classes = useStyles();
  const { register, errors, getValues, handleSubmit } = useForm<UserFormData>();

  const uniqueValidation = async (
    fieldName: 'cpf' | 'email',
    value: string,
  ) => {
    const values = getValues();

    // Only make a request to the api if the field has changed
    if (user?.[fieldName] === values[fieldName]) {
      return true;
    }

    const {
      data: { available },
    } = await userAvailable({
      value,
    });

    return available;
  };

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ textAlign: 'center' }}>
        <AvatarField
          src={user?.avatar}
          name="avatar"
          size={100}
          register={register}
        />
      </div>

      <TextField
        inputRef={register({
          required: 'Please enter your name',
          maxLength: {
            value: 100,
            message: 'The name is too long',
          },
        })}
        error={!!errors.name}
        helperText={errors.name?.message}
        defaultValue={user?.name}
        name="name"
        label="Name"
        fullWidth
        autoFocus
      />

      <TextField
        inputRef={register({
          required: 'Please enter your e-mail address',
          maxLength: {
            value: 100,
            message: 'The e-mail address is too long',
          },
          pattern: {
            value: /^[^\s]+@[^\s]+\.[^\s]+$/,
            message: 'The e-mail address is invalid',
          },
          validate: async value =>
            (await uniqueValidation('email', value)) ||
            `The e-mail address has already been taken`,
        })}
        className={classes.textField}
        error={!!errors.email}
        helperText={errors.email?.message}
        defaultValue={user?.email}
        name="email"
        label="E-mail"
        type="email"
        fullWidth
      />

      <TextField
        inputRef={register({
          required: 'Please enter your CPF',
          validate: {
            format: value => isCpf(value) || 'The CPF is invalid',
            unique: async value =>
              (await uniqueValidation('cpf', value)) ||
              `The CPF has already been taken`,
          },
        })}
        className={classes.textField}
        error={!!errors.cpf}
        helperText={errors.cpf?.message}
        defaultValue={user?.cpf}
        name="cpf"
        label="CPF"
        placeholder="000.000.000-00"
        fullWidth
      />
    </form>
  );
};

export default UserForm;
