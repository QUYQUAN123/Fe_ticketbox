import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import React from "react";

const ConfirmDelete = ({ open, title, content, handleClose, handleOk }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <Typography variant="h6" fontWeight={"bold"}>
          {title || "XÁC NHẬN XÓA"}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography variant="subtitle2">
            {content ||
              "Bạn có muốn chắc chắn xóa không? nếu xóa sẽ không thể khôi phục được !"}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="outlined"
          color="error"
          size="small"
        >
          Không đồng ý
        </Button>
        <Button autoFocus onClick={handleOk} size="small" variant="contained">
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelete;
