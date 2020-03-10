import React, { useState } from 'react';
import { useForm, OnSubmit } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { isCpf } from '../utils';
import { available as userAvailable, UserFormData } from '../services/users';
import AvatarField from './AvatarField';
import { User } from '../model/users';

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

export default function UserForm({ id, user, onSubmit }: UserFormProps) {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
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
          validate: async (value: string) =>
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
            format: (value: string) => isCpf(value) || 'The CPF is invalid',
            unique: async (value: string) =>
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

      <FormControl
        className={classes.textField}
        error={!!errors.password}
        fullWidth
      >
        <InputLabel>Password</InputLabel>
        <Input
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          name="password"
          inputRef={register({
            ...(user?.id ? {} : { required: 'Please enter your password' }),
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{8,}$/,
              message:
                'The password must contain at least 8 characters, including uppercase and lowercase letters, a number and one special character.',
            },
          })}
        />
        <FormHelperText>{errors.password?.message}</FormHelperText>
      </FormControl>
    </form>
  );
}
