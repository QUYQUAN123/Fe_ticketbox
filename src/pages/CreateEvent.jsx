import React, { useEffect } from "react";
import EventLayout from "../components/layout/EventLayout";
import { Box, Paper, TextField, Typography } from "@mui/material";
import ButtonCustom from "../components/common/ButtonCustom";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
  const navigate = useNavigate();

  useEffect(() => {

    const checkLogin = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) navigate("/login");
    };
    checkLogin();
  }, []);
  return (
    <EventLayout>
      <Box position={"relative"}>
        <Box
          component={"img"}
          src={"/img/bgcreateevent.jpg"}
          sx={{ opacity: 0.8, objectFit: "cover" }}
          width={"100%"}
        />
        <Box
          position={"absolute"}
          component={Paper}
          top={"30%"}
          left={"50%"}
          sx={{ transform: "translate(-50%, -50%)", minWidth: "25vw" }}
          p={2}
          elevation={3}
        >
          <Typography variant="h4" textAlign={"center"}>
            Tạo sự kiện
          </Typography>
          <Box mt={4}>
            <Typography fontSize={18}>Tên sự kiện:</Typography>
            <TextField fullWidth size="small" />
            <Typography fontSize={18} mt={2}>
              Tên địa điểm:
            </Typography>
            <TextField fullWidth size="small" />
            <Typography fontSize={18} mt={2}>
              Địa chỉ:
            </Typography>
            <TextField fullWidth size="small" />
            <Typography fontSize={18} mt={2}>
              Thể loại sự kiện:
            </Typography>
            <TextField fullWidth size="small" />
            <Box mt={4}>
              <ButtonCustom
                fullWidth
                variant="contained"
                size={"large"}
                text={"Tạo sự kiện"}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </EventLayout>
  );
}

export default CreateEvent;
