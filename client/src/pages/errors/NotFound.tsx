import React from 'react';
import { RouteComponentProps, Link } from '@reach/router';

const NotFoundPage: React.FC<RouteComponentProps> = () => {
  return (
    <>
      <h1>The page you are looking for doesn't exist</h1>
      <Link to="/">Back to Dashboard page</Link>
    </>
  );
};

export default NotFoundPage;
