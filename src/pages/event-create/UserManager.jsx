import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Typography,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import {
  list,
  create,
  update,
  deleteUser,
  findUser,
} from "../../utils/api/user";
import AdminLayout from "../../components/layout/AdminLayout";

const UserManagement = () => {
  // State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    sex: 1,
    role: 0,
    image: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await list();
      setUsers(response.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      showSnackbar("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      sex: 1,
      role: 0,
      image: "",
    });
  };

  const handleOpenCreateDialog = () => {
    resetForm();
    setOpenCreateDialog(true);
  };

  const handleOpenEditDialog = async (userId) => {
    try {
      setLoading(true);
      const response = await findUser(userId);
      const userData = response.data;

      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        password: "",
        phone: userData.phone || "",
        sex: userData.sex === undefined ? 1 : userData.sex,
        role: userData.role === undefined ? 0 : userData.role,
        image: userData.image || "",
        status: userData.status || "active",
      });

      setSelectedUser(userData);
      setOpenEditDialog(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      showSnackbar("Failed to load user details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenViewDialog = async (userId) => {
    try {
      setLoading(true);
      const response = await findUser(userId);
      setSelectedUser(response.data);
      setOpenViewDialog(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      showSnackbar("Failed to load user details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (user) => {
    if (user.role === 1) {
      showSnackbar("Không thể xóa tài khoản Admin", "error");
      return;
    }
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
    setOpenViewDialog(false);
    setOpenDeleteDialog(false);
    setOpenCreateDialog(false);
    setSelectedUser(null);
    resetForm();
  };

  const handleCreateUser = async () => {
    try {
      setLoading(true);
      await create(formData);
      showSnackbar("User created successfully", "success");
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      showSnackbar("Failed to create user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    try {
      setLoading(true);

      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      await update(selectedUser._id, payload);
      showSnackbar("User updated successfully", "success");
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      showSnackbar("Failed to update user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      await deleteUser(selectedUser._id);
      showSnackbar("User deleted successfully", "success");
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      showSnackbar("Failed to delete user", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };
  const displayStatus = formData.status === "active" ? "Hoạt động" : "Khóa";
  console.log("Hiển thị trạng thái:", displayStatus);

  return (
    <AdminLayout>
      <Container sx={{ py: 4, px: "8%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Quản lý tài khoản người dùng
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
          >
            Thêm tài khoản mới
          </Button>
        </Box>

        {loading &&
        !openEditDialog &&
        !openViewDialog &&
        !openDeleteDialog &&
        !openCreateDialog ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Ảnh đại diện</TableCell>
                    <TableCell>Họ và Tên</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Số điện thoại</TableCell>
                    <TableCell>Giới tính</TableCell>
                    <TableCell>Quyền</TableCell>
                    <TableCell>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow hover key={user._id}>
                        <TableCell>
                          <Avatar src={user.image} alt={user.name}>
                            {user.name ? user.name.charAt(0) : "U"}
                          </Avatar>
                        </TableCell>
                        <TableCell>{user.name || "N/A"}</TableCell>
                        <TableCell>{user.email || "N/A"}</TableCell>
                        <TableCell>{user.phone || "N/A"}</TableCell>{" "}
                        <TableCell>{user.sex === 0 ? "Nữ" : "Nam"}</TableCell>
                        <TableCell>
                          {user.role === 1
                            ? "Người quản lý"
                            : user.role === 2
                            ? "Người tổ chức"
                            : "Người dùng"}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Xem">
                            <IconButton
                              onClick={() => handleOpenViewDialog(user._id)}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chỉnh sửa">
                            <IconButton
                              onClick={() => handleOpenEditDialog(user._id)}
                              disabled={user.role === 1}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleOpenDeleteDialog(user)}
                              disabled={user.role === 1}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={users.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}

        <Dialog
          open={openViewDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Chi tiết người dùng</DialogTitle>
          <DialogContent>
            {selectedUser && (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
              >
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <Avatar
                    src={selectedUser.image}
                    alt={selectedUser.name}
                    sx={{ width: 100, height: 100 }}
                  >
                    {selectedUser.name ? selectedUser.name.charAt(0) : "U"}
                  </Avatar>
                </Box>
                <TextField
                  label="Họ và tên"
                  value={selectedUser.name || ""}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Email"
                  value={selectedUser.email || ""}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Số điện thoại"
                  value={selectedUser.phone || ""}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Giới tính"
                  value={selectedUser.sex === 0 ? "Nữ" : "Nam"}
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                />{" "}
                <TextField
                  label="Quyền"
                  value={
                    selectedUser.role === 1
                      ? "Người quản lý"
                      : selectedUser.role === 2
                      ? "Người tổ chức"
                      : "Người dùng"
                  }
                  InputProps={{ readOnly: true }}
                  fullWidth
                  variant="outlined"
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Đóng</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openCreateDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Tạo người dùng mới</DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <TextField
                label="Họ và tên"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />

              <TextField
                label="Mật khẩu"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                required
              />

              <TextField
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                required
              />

              <TextField
                label="URL hình ảnh hồ sơ"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />

              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="sex"
                  value={formData.sex}
                  label="Giới tính"
                  onChange={handleInputChange}
                >
                  <MenuItem value={1}>Nam</MenuItem>
                  <MenuItem value={0}>Nữ</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Quyền</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Quyền"
                  onChange={handleInputChange}
                >
                  <MenuItem value={0}>Người dùng</MenuItem>
                  <MenuItem value={2}>Người tổ chức</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Thoát</Button>
            <Button
              onClick={handleCreateUser}
              color="primary"
              disabled={!formData.password || !formData.phone}
            >
              {loading ? <CircularProgress size={24} /> : "Tạo"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openEditDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Chỉnh sửa </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                required
                InputProps={{ readOnly: true }}
              />

              <TextField
                label="Profile Image URL"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
              />

              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="sex"
                  value={formData.sex}
                  label="Gender"
                  onChange={handleInputChange}
                >
                  <MenuItem value={1}>Nam</MenuItem>
                  <MenuItem value={0}>Nữ</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Quyền</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleInputChange}
                >
                  <MenuItem value={0}>Người Dùng </MenuItem>
                  <MenuItem value={2}>Người Tổ Chức</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Trạng thái </InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Trạng thái"
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="banned">Khóa</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Thoát</Button>
            <Button
              onClick={handleUpdateUser}
              color="primary"
              disabled={!formData.phone}
            >
              {loading ? <CircularProgress size={24} /> : "Cập Nhật"}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
          <DialogTitle>Xác Nhận Xóa</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn chắc chắn muốn xóa người dùng "
              {selectedUser?.name || "this user"}" thay vì khóa tài khoản? Không
              thể hoàn tắc .
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Thoát</Button>
            <Button onClick={handleDeleteUser} color="error">
              {loading ? <CircularProgress size={24} /> : "XÓA"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </AdminLayout>
  );
};

export default UserManagement;
