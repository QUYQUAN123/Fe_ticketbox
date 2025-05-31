import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

const ModalUpdate = ({
  open,
  title,
  children,
  handleClose,
  handleOk,
  showCancel = true,
  showOk = true,
  titleOk,
  maxWidth,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth={maxWidth ? maxWidth : "sm"}
    >
      <Box component={"form"} onSubmit={handleOk}>
        <DialogTitle id="alert-dialog-title">
          <Typography fontWeight={"bold"} variant="h6">
            {title || "Hộp thoại cập nhật"}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box>{children}</Box>
        </DialogContent>
        <DialogActions>
          {showCancel && (
            <Button
              onClick={handleClose}
              variant="outlined"
              color="error"
              size="small"
            >
              Không đồng ý
            </Button>
          )}
          {showOk && (
            <Button
              autoFocus
              onClick={handleOk}
              size="small"
              variant="contained"
            >
              {titleOk || "Đồng ý"}
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default ModalUpdate;
