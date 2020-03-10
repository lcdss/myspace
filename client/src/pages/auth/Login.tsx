import React from 'react';
import { useForm } from 'react-hook-form';
import { RouteComponentProps, useNavigate } from '@reach/router';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { useStoreActions } from '../../hooks';

type LoginForm = {
  email: string;
  password: string;
};

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LoginPage: React.FC<RouteComponentProps> = () => {
  const classes = useStyles();
  const { register, errors, handleSubmit } = useForm<LoginForm>();
  const navigate = useNavigate();
  const { login, loadAuth } = useStoreActions(actions => actions.auth);

  const handleOnSubmit = handleSubmit(async credentials => {
    login(credentials)
      .then(() => loadAuth())
      .then(() => navigate('/'))
      .catch((error: any) => console.log(error));
  });

  return (
    <div className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>

      <form className={classes.form} onSubmit={handleOnSubmit} noValidate>
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
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          variant="outlined"
          margin="normal"
          label="E-mail"
          name="email"
          fullWidth
          autoFocus
        />
        <TextField
          inputRef={register({
            required: 'Please enter your password',
            maxLength: {
              value: 100,
              message: 'The password is too long',
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          variant="outlined"
          margin="normal"
          name="password"
          label="Password"
          type="password"
          fullWidth
        />
        <Button
          className={classes.submit}
          type="submit"
          color="primary"
          variant="contained"
          fullWidth
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
