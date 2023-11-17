import React, { FC, useEffect } from 'react';
import { useAtom } from 'jotai';
import { activeSnackbarState } from '../../store/atom';
import { Box } from '@mui/material';

export const Snackbar: FC = () => {
  const [activeSnackbar, setActivesnackbar] = useAtom(activeSnackbarState);

  useEffect(() => {
    if (activeSnackbar) {
      const timer = setTimeout(() => {
        setActivesnackbar(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [setActivesnackbar, activeSnackbar]);

  return (
    <>
      {activeSnackbar && (
        <Box
          sx={{ width: '100%', backgroundColor: '#fff', textAlign: 'center' }}
        >
          <Box component="h2" sx={{ color: '#31a899', m: 0, p: 1 }}>
            データの送信が完了しました
          </Box>
        </Box>
      )}
    </>
  );
};
