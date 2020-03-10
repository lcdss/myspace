import React from 'react';
import { useNavigate } from '@reach/router';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useStoreActions } from '../../../hooks/index';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    color: theme.palette.primary.contrastText,
  },
  menu: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
    textDecoration: 'none',
    color: theme.palette.primary.contrastText,
  },
}));

export default function Header() {
  const classes = useStyles();
  const navigate = useNavigate();
  const logout = useStoreActions(actions => actions.auth.logout);

  const handleLogout = () => {
    logout()
      .then(() => navigate('/auth/login'))
      .catch((error: any) => console.error('Error while logging out', error));
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          MySpace
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
