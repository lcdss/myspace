import React, { ReactElement } from 'react';
import { RouteComponentProps, Link } from '@reach/router';

type NotFoundPageProps = (props: RouteComponentProps) => ReactElement;

const NotFoundPage: NotFoundPageProps = () => {
  return (
    <>
      <h1>The page you are looking for doesn't exist</h1>
      <Link to="/">Back to Dashboard page</Link>
    </>
  );
};

export default NotFoundPage;
