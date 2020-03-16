import React, { ReactElement } from 'react';
import { RouteComponentProps } from '@reach/router';
import GoogleFilePicker from '../../components/GooglePicker';

type HomePageProps = (props: RouteComponentProps) => ReactElement;

const HomePage: HomePageProps = () => {
  return (
    <GoogleFilePicker
      scope={[
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/photos',
        'https://www.googleapis.com/auth/photos.upload',
      ]}
      viewId={['DOCS', 'PHOTO_ALBUMS', 'PHOTO_UPLOAD']}
    />
  );
};

export default HomePage;
