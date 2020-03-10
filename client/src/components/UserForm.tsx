import * as yup from 'yup';
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

  const formSchema = yup.object().shape({
    name: yup
      .string()
      .required()
      .max(100),
    email: yup
      .string()
      .required()
      .email()
      .max(100)
      .test('check-duplication', 'email is already taken', value =>
        uniqueValidation('email', value),
      ),
    cpf: yup
      .string()
      .required()
      .max(14)
      .test('is-cpf', 'cpf is invalid', value => isCpf(value))
      .test('check-duplication', 'cpf is already taken', value =>
        uniqueValidation('cpf', value),
      ),
    password: yup
      .string()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d\s]).{8,}$/,
        'password must include uppercase and lowercase letters, a number and one special character',
      ),
  });

  const { register, errors, getValues, handleSubmit } = useForm<UserFormData>({
    validationSchema: formSchema,
  });

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
        inputRef={register}
        error={!!errors.name}
        helperText={errors.name?.message}
        defaultValue={user?.name}
        name="name"
        label="Name"
        fullWidth
        autoFocus
      />

      <TextField
        inputRef={register}
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
        inputRef={register}
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
          inputRef={register}
        />
        <FormHelperText>{errors.password?.message}</FormHelperText>
      </FormControl>
    </form>
  );
}
