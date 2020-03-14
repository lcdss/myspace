import React from 'react';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  footer: {
    padding: theme.spacing(2),
    marginTop: 'auto',
    backgroundColor: theme.palette.secondary.main,
    textAlign: 'center',
  },
}));

export default function Footer() {
  const classes = useStyles();

  return (
    <Box className={classes.footer} component="footer">
      <Typography variant="subtitle2" color="textPrimary">
        {'© Copyright 2020, '}
        <Link
          color="inherit"
          href="https://github.com/lcdss/myspace"
          target="_blank"
        >
          MySpace
        </Link>
      </Typography>
    </Box>
  );
}
