import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

// MyModalコンポーネントのProps型定義
type ModalProps = {
  open: boolean;
  onClose: (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => void;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
