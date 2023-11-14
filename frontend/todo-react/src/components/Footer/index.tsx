import { Box } from '@mui/material';
import React, { FC } from 'react';

export const Footer: FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#31a899',
        color: '#fff',
      }}
    >
      <Box
        sx={{
          width: '90%',
          margin: '0 auto',
          padding: '5px 0',
          textAlign: 'center',
        }}
      >
        <Box component="span">Copyright Chat To Do All Rights Reserved.</Box>
      </Box>
    </Box>
  );
};
