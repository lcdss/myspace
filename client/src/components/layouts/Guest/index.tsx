import React from 'react';
import Container from '@material-ui/core/Container';
import { RouteComponentProps } from '@reach/router';

const GuestLayout: React.FC<RouteComponentProps> = ({ children }) => {
  return (
    <Container component="main" maxWidth="xs">
      {children}
    </Container>
  );
};

export default GuestLayout;
