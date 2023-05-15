import * as React from "react";
import {
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

export interface DialogProps {
  title: React.ReactNode;
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  loading?: boolean;
  onConfirm?: () => Promise<void>;
  disabled?: boolean;
  confirmText?: string;
}

export default function SimpleDialog({
  title,
  open,
  onClose,
  children,
  loading,
  onConfirm,
  disabled,
  confirmText,
}: DialogProps) {
  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ minWidth: "520px", padding: "20px 0 0 0" }}>{children}</Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (onConfirm) onConfirm();
          }}
          autoFocus
          disabled={loading || !!disabled}
        >
          {loading ? (
            <CircularProgress
              size={20}
              color="inherit"
              sx={{ margin: "0 5px 0 0" }}
            ></CircularProgress>
          ) : null}
          {!!confirmText ? confirmText : "Confirm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
