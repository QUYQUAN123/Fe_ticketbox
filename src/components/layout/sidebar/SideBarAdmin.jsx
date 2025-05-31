import { Box, Button, Typography, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KeyboardReturnOutlinedIcon from "@mui/icons-material/KeyboardReturnOutlined";

const NumberText = styled("span")({
  background: "#8f9499",
  color: "#303b46",
  borderRadius: 15,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: 30,
  height: 30,
  lineHeight: 30,
});

const Item = styled(Box)({
  padding: "1.5em 2em",
  "&:hover": {
    background: "#dadada",
    "& p": {
      color: "#303b46",
    },
    "& span": {
      background: "#303b46",
      color: "#8f9499",
    },
  },
  cursor: "pointer",
});

function SideBarAdmin() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const getData = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) setUser(user);
    };
    getData();
  }, []);

  return (
    <Box
      position={"sticky"}
      top={0}
      width={"25vw"}
      height={"100vh"}
      bgcolor={"#303b46"}
    >
      <Box
        padding={"1em 2em"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box display={"flex"} alignItems={"center"} gap={1}>
          <Box
            component={"img"}
            src={user?.image || "/img/LogoHCMUTE.jpg"}
            sx={{ objectFit: "cover", borderRadius: "4px" }}
            width={40}
            height={40}
            style={{ cursor: "pointer" }}
            onClick={() => {
              localStorage.removeItem("errorEventInfo");
              navigate("/");
            }}
          />
          <Typography color={"white"} typography={"subtitle2"}>
            {user?.name}
          </Typography>
        </Box>
        <Box>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Box>
      </Box>      <Box mt={4}>        {user?.role === 2 && (
        <>
          <Item onClick={() => navigate("/my-revenue")}>
            <Box display={"flex"} gap={2} alignItems={"center"}>
              <NumberText>1</NumberText>
              <Typography color={"white"}>Doanh thu</Typography>
            </Box>
          </Item>
          <Item onClick={() => {
            localStorage.removeItem("eventInfo");
            localStorage.removeItem("ticketAndTime");
            localStorage.removeItem("settingEvent");
            localStorage.removeItem("isEditing");
            navigate("/event-info")
          }
          }>
            <Box display={"flex"} gap={2} alignItems={"center"}>
              <NumberText>2</NumberText>
              <Typography color={"white"}>Tạo sự kiện</Typography>
            </Box>
          </Item>
          <Item onClick={() => navigate("/info-payment-event")}>
            <Box display={"flex"} gap={2} alignItems={"center"}>
              <NumberText>3</NumberText>
              <Typography color={"white"}>Lịch sử thanh toán</Typography>
            </Box>
          </Item>
          <Item onClick={() => navigate("/my-tickets")}>
            <Box display={"flex"} gap={2} alignItems={"center"}>
              <NumberText>4</NumberText>
              <Typography color={"white"}>Vé đã mua</Typography>
            </Box>
          </Item>
          <Item onClick={() => navigate("/my-event")}>
            <Box display={"flex"} gap={2} alignItems={"center"}>
              <NumberText>5</NumberText>
              <Typography color={"white"}>Sự kiện đã tạo của tôi</Typography>
            </Box>
          </Item>
          <Item onClick={() => navigate(`/account/${user?._id}`)}>
            <Box display={"flex"} gap={2} alignItems={"center"}>
              <NumberText>6</NumberText>
              <Typography color={"white"}>Cập nhật thông tin</Typography>
            </Box>
          </Item>
        </>
      )}        {user?.role === 0 && (
        <>
          <Item onClick={() => navigate(`/account/${user?._id}`)}>
            <Box display={"flex"} gap={2} alignItems={"center"}>
              <NumberText>1</NumberText>
              <Typography color={"white"}>Cập nhật thông tin</Typography>
            </Box>
          </Item>
          <Item onClick={() => navigate("/my-tickets")}>
            <Box display={"flex"} gap={2} alignItems={"center"}>
              <NumberText>2</NumberText>
              <Typography color={"white"}>Vé đã mua</Typography>
            </Box>
          </Item>
          <Item onClick={() => navigate("/info-payment-event")}>
            <Box display={"flex"} gap={2} alignItems={"center"}>
              <NumberText>3</NumberText>
              <Typography color={"white"}>Lịch sử thanh toán</Typography>
            </Box>
          </Item>
        </>
      )}
        {user?.role === 1 && (
          <>
            <Item onClick={() => navigate("/admin-manager-ticket")}>
              <Box display={"flex"} gap={2} alignItems={"center"}>
                <NumberText>1</NumberText>
                <Typography color={"white"}>Thống kê vé sự kiện </Typography>
              </Box>
            </Item>
            <Item onClick={() => navigate("/admin-revenue")}>
              <Box display={"flex"} gap={2} alignItems={"center"}>
                <NumberText>2</NumberText>
                <Typography color={"white"}>Doanh thu</Typography>
              </Box>
            </Item>
            <Item onClick={() => navigate("/admin-manager-user")}>
              <Box display={"flex"} gap={2} alignItems={"center"}>
                <NumberText>3</NumberText>
                <Typography color={"white"}>Quản lý tài khoản</Typography>
              </Box>
            </Item>
            <Item onClick={() => navigate("/approve-event")}>
              <Box display={"flex"} gap={2} alignItems={"center"}>
                <NumberText>4</NumberText>
                <Typography color={"white"}>Phê duyệt sự kiện</Typography>
              </Box>
            </Item>
          </>
        )}        <Box p={4}>
          <Button
            startIcon={<KeyboardReturnOutlinedIcon />}
            fullWidth
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
          >
            Quay về trang chủ
          </Button>
        </Box>
      </Box>


    </Box>
  );
}

export default SideBarAdmin;
