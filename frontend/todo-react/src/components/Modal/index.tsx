import React, { FC } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
      <Box display="flex" justifyContent="space-between">
        <DialogTitle>{title}</DialogTitle>
        <DialogActions>
          <Button onClick={onClose}>
            <CloseIcon
              sx={{
                color: '#31a899',
              }}
              fontSize="medium"
            />
          </Button>
        </DialogActions>
      </Box>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};
