import React, { FC } from 'react';
import { Typography, Container } from '@mui/material';

const NotFound: FC = () => {
  return (
    <>
      <Container sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6" margin={4}>
          このページは存在しません。
        </Typography>
      </Container>
    </>
  );
};

export default NotFound;
