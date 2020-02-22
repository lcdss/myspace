import React from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';

const Content: React.FC = ({ children }) => (
  <Box py={3} component="main">
    <Container fixed>{children}</Container>
  </Box>
);

export default Content;
