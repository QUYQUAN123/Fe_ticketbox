import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  Grid,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { registerOrganizer, verifyOTP, resendOTP } from "../utils/api/user";

function OrganizerSignUp() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is already logged in
    const checkLogin = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) navigate("/");
    };
    checkLogin();
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error message when user types
    setErrorMessage("");
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setOtpError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Họ tên không được để trống");
      return false;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Email không được để trống");
      return false;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Email không hợp lệ");
      return false;
    }

    if (!formData.phone.trim()) {
      setErrorMessage("Số điện thoại không được để trống");
      return false;
    }

    // Simple phone number validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage("Số điện thoại phải có 10 chữ số");
      return false;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp");
      return false;
    }

    if (!formData.agreeTerms) {
      setErrorMessage("Bạn phải đồng ý với điều khoản dịch vụ");
      return false;
    }

    return true;
  }; const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };
      const response = await registerOrganizer(payload);

      if (response.status === 201) {
        setOtpDialogOpen(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Có lỗi xảy ra khi đăng ký");
    }
  };
  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setOtpError("Mã OTP phải có 6 chữ số");
      return;
    }

    try {
      const response = await verifyOTP({
        email: formData.email,
        otp: otp,
      });

      if (response.status === 200) {
        setOtpDialogOpen(false);
        setSuccessDialogOpen(true);
      }
    } catch (error) {
      setOtpError(error.response?.data?.error || "Mã OTP không chính xác");
    }
  };
  const handleResendOtp = async () => {
    try {
      const response = await resendOTP({
        email: formData.email,
      });

      if (response.status === 200) {
        alert("Mã OTP mới đã được gửi đến email của bạn");
      }
    } catch (error) {
      setOtpError(error.response?.data?.error || "Có lỗi xảy ra khi gửi lại OTP");
    }
  };

  return (<Box
    sx={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 2,
      backgroundColor: "#F5F7FC",
      backgroundImage: "url('/img/bgcreateevent.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.85)",
      }
    }}
  >      <Paper
    elevation={3}
    sx={{
      padding: 4,
      width: "100%",
      maxWidth: 600,
      borderRadius: 2,
      position: "relative",
      zIndex: 1,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      border: "1px solid rgba(0,0,0,0.05)"
    }}
  >
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Đăng ký tài khoản Người tổ chức
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Tạo sự kiện và tham gia cùng chúng tôi
        </Typography>
      </Box>

      {errorMessage && (
        <Box
          sx={{
            backgroundColor: "#fdeded",
            color: "#f44336",
            padding: 2,
            borderRadius: 1,
            mb: 2,
          }}
        >
          <Typography variant="body2">{errorMessage}</Typography>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Họ tên"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          required
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          required
          helperText="Email sẽ dùng để xác minh tài khoản"
        />

        <TextField
          fullWidth
          label="Số điện thoại"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          required
        />

        <TextField
          fullWidth
          label="Mật khẩu"
          name="password"
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={formData.confirmPassword}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              color="primary"
            />
          }
          label="Tôi đồng ý với điều khoản dịch vụ"
          sx={{ mt: 1 }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          Đăng ký
        </Button>

        <Grid container spacing={1}>
          <Grid item xs>
            <Link
              href="#"
              variant="body2"
              onClick={() => navigate("/sign-up")}
            >
              Đăng ký tài khoản thường
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2" onClick={() => navigate("/login")}>
              Đã có tài khoản? Đăng nhập
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Paper>

    {/* OTP Dialog */}
    <Dialog open={otpDialogOpen} onClose={() => { }}>
      <DialogTitle>Xác thực tài khoản</DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          Chúng tôi đã gửi mã OTP gồm 6 chữ số đến email của bạn. Vui lòng kiểm tra hộp thư đến và nhập mã xác thực để hoàn tất đăng ký.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Mã OTP"
          fullWidth
          variant="outlined"
          value={otp}
          onChange={handleOtpChange}
          error={!!otpError}
          helperText={otpError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleResendOtp}>Gửi lại mã</Button>
        <Button onClick={handleVerifyOtp} variant="contained">Xác nhận</Button>
      </DialogActions>
    </Dialog>

    {/* Success Dialog */}
    <Dialog open={successDialogOpen} onClose={() => navigate("/login")}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CheckCircle color="success" />
        Đăng ký thành công
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Chúc mừng! Bạn đã đăng ký tài khoản Organizer thành công. Bạn có thể đăng nhập ngay bây giờ.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => navigate("/login")} variant="contained">
          Đăng nhập ngay
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
  );
}

export default OrganizerSignUp;
