import React, { ReactNode } from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

type ContentProps = {
  children: ReactNode;
};

export default function Content({ children }: ContentProps) {
  return (
    <Box py={3} component="main">
      <Container fixed>{children}</Container>
    </Box>
  );
}
