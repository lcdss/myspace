import React, { ReactNode } from 'react';
import Container from '@material-ui/core/Container';
import { RouteComponentProps } from '@reach/router';

interface GuestLayoutProps extends RouteComponentProps {
  children: ReactNode;
}

const GuestLayout = ({ children }: GuestLayoutProps) => {
  return (
    <Container component="main" maxWidth="xs">
      {children}
    </Container>
  );
};

export default GuestLayout;
