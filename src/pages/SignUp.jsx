import { Box, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import { useNavigate } from "react-router-dom";
import ButtonCustom from "../components/common/ButtonCustom";
import { notify } from "../utils/helpers/notify";
import { create } from "../utils/api/user";

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState(""); // Họ tên
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword)
        return notify("warn", "Mật khẩu nhập lại không khớp");

      await create({ name, phone, password }); // Gửi name vào API
      notify("success", "Tạo tài khoản mới thành công");
      setName("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      navigate("/login"); // Chuyển hướng sau khi tạo tài khoản
    } catch (error) {
      notify(
        "error",
        error?.response?.data?.message || "Đăng kí tài khoản không thành công"
      );
    }
  };

  useEffect(() => {
    const checkLogin = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) navigate("/");
    };
    checkLogin();
  }, [navigate]);

  return (
    <Box
      bgcolor={"#F5F7FC"}
      width={"100vw"}
      height={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Paper elevation={3}>
        <Box
          p={2}
          minWidth={"20vw"}
          component={"form"}
          onSubmit={handleCreateUser}
        >
          <Box
            display={"flex"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            position={"relative"}
            sx={{ cursor: "pointer" }}
          >
            <ArrowBackIosOutlinedIcon
              sx={{ height: 20 }}
              onClick={() => navigate("/")}
            />
            <Box
              position={"absolute"}
              left={"50%"}
              sx={{ transform: "translateX(-50%)" }}
            >
              <Typography fontSize={16} fontWeight={"700"} textAlign={"center"}>
                Đăng ký
              </Typography>
            </Box>
            <Box mt={4}></Box>
          </Box>
          <Box mt={4} px={2}>
            {/* Họ tên */}
            <Box>
              <Typography variant="subtitle2">Họ và tên:</Typography>
              <Box>
                <TextField
                  required
                  fullWidth
                  size="small"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
            </Box>
            {/* Số điện thoại */}
            <Box mt={2}>
              <Typography variant="subtitle2">Số điện thoại:</Typography>
              <Box>
                <TextField
                  required
                  fullWidth
                  size="small"
                  placeholder="+848141778178"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                />
              </Box>
            </Box>
            {/* Mật khẩu */}
            <Box mt={2}>
              <Typography variant="subtitle2">Mật khẩu:</Typography>
              <Box>
                <TextField
                  required
                  fullWidth
                  size="small"
                  placeholder="Nhập mật khẩu"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Box>
            </Box>
            {/* Nhập lại mật khẩu */}
            <Box mt={2}>
              <Typography variant="subtitle2">Nhập lại mật khẩu:</Typography>
              <Box>
                <TextField
                  required
                  fullWidth
                  size="small"
                  placeholder="Nhập lại mật khẩu"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Box>
            </Box>
            {/* Nút Đăng ký */}
            <Box mt={4}>
              <ButtonCustom
                fullWidth
                variant="contained"
                text={"Đăng ký"}
                type="submit"
              />
            </Box>
            {/* Link cho Người tổ chức */}
            <Box mt={2} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Bạn muốn tổ chức sự kiện?{" "}
                <Box
                  component="span"
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    fontWeight: "bold",
                    textDecoration: "underline",
                  }}
                  onClick={() => navigate("/organizer-sign-up")}
                >
                  Đăng ký tài khoản Người tổ chức
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default SignUp;
