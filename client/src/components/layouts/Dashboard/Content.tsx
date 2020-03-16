import React, { ReactNode } from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

type ContentProps = {
  children: ReactNode;
};

const drawerWidth = 240;

const useStyles = makeStyles(() => ({
  content: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
}));

export default function Content({ children }: ContentProps) {
  const classes = useStyles();

  return (
    <Box py={3} component="main" className={classes.content}>
      <Container fixed>{children}</Container>
    </Box>
  );
}
