import React, { FC } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material';

// MyModalコンポーネントのProps型定義
type ModalProps = {
  open: boolean;
  onClose: (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => void;
  title?: string;
  children: React.ReactNode;
};

type CustomPaperProps = {
  children?: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title = '',
  children,
}) => {
  // Dialog のスタイルを上書き
  const CustomPaper: FC<CustomPaperProps> = ({ children }) => {
    return (
      <Box
        sx={{
          boxShadow: 'none',
          backgroundColor: '#fff',
          borderRadius: 2,
          minWidth: '60%',
        }}
      >
        {children}
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{ boxShadow: 'none' }}
      PaperComponent={CustomPaper}
      slotProps={{
        backdrop: {
          style: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
