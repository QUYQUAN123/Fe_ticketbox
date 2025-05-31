import { Box, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import { useNavigate } from "react-router-dom";
import ButtonCustom from "../components/common/ButtonCustom";
import { notify } from "../utils/helpers/notify";
import { login } from "../utils/api/user";

function Login() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ phone, password });
      notify("success", "Đăng nhập thành công");
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      notify("error", error?.response?.data?.message || "Lỗi đăng nhập");
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
        <Box p={2} minWidth={"20vw"}>
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
                Đăng nhập
              </Typography>
            </Box>
            <Box mt={4}></Box>
          </Box>
          <Box mt={4} px={2} component={"form"} onSubmit={handleLogin}>
            <Box>
              <Typography variant="subtitle2">Số điện thoại:</Typography>
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="+848141778178"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </Box>
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle2">Mật khẩu:</Typography>
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập mật khẩu"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Box>
            </Box>            <Box mt={4}>
              <ButtonCustom
                fullWidth
                variant="contained"
                text={"Đăng nhập"}
                type="submit"
              />
            </Box>

            <Box mt={2} display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2" textAlign="center">
                Chưa có tài khoản?{" "}
                <Box
                  component="span"
                  sx={{
                    color: "primary.main",
                    cursor: "pointer",
                    fontWeight: "bold",
                    textDecoration: "underline",
                  }}
                  onClick={() => navigate("/sign-up")}
                >
                  Đăng ký ngay
                </Box>
              </Typography>

              <Typography variant="body2" textAlign="center">
                Muốn tổ chức sự kiện?{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#2dc275",
                    cursor: "pointer",
                    fontWeight: "bold",
                    textDecoration: "underline",
                  }}
                  onClick={() => navigate("/organizer-sign-up")}
                >
                  Đăng ký tài khoản người tổ chức
                </Box>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
