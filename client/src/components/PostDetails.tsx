import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import http from '../services/http';

interface PostResponse {
  title: string;
  body: string;
}

interface PostDetailsProps {
  id: number;
}

const PostDetails = ({ id }: PostDetailsProps) => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<PostResponse>();
  const [error, setError] = useState(false);

  useEffect(() => {
    http
      .get<PostResponse>(
        `https://jsonplaceholder.typicode.com/posts/${
          id > 100 ? id % 100 : id
        }`,
      )
      .then(({ data }) => {
        setPost(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (error) return <div>Error</div>;

  if (loading || !post) {
    return (
      <Grid style={{ padding: '1rem 0', textAlign: 'center' }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <ul>
      <li>Title: {post.title}</li>
      <li>Body: {post.body}</li>
    </ul>
  );
};

export default PostDetails;
