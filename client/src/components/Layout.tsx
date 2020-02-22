import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Header from './Header';
import Content from './Content';
import Footer from './Footer';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
}));

const Layout: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </div>
  );
};

export default Layout;
