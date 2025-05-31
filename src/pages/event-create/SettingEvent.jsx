import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  Box,
  Paper,
  Typography,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import ButtonCustom from "../../components/common/ButtonCustom";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/helpers/notify";
import { create, update } from "../../utils/api/event";

export default function SettingEvent() {
  const navigate = useNavigate();
  const [permission, setPermission] = useState("1");
  const [percent, setPercent] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [eventId, setEventId] = useState(null);

  const handleSaveEvent = async () => {
    const ticketAndTime = JSON.parse(localStorage.getItem("ticketAndTime"));
    const eventInfo = JSON.parse(localStorage.getItem("eventInfo"));
    const user = JSON.parse(localStorage.getItem("user"));
    const { ticket, ...rest } = ticketAndTime;
    const { typeEvent, ...rest1 } = eventInfo;
    const payload = {
      ...rest1,
      ...rest,
      ticket: JSON.stringify(ticket),
      owner: user?._id,
      permission: Number(permission),
      typeEvent: Number(typeEvent),
      percent: Number(percent),
    };

    try {
      if (isEditing && eventId) {
        // Cập nhật sự kiện đã tồn tại
        await update(eventId, payload);
        notify("success", "Cập nhật sự kiện thành công, vui lòng chờ đợi phê duyệt");
      } else {
        // Tạo sự kiện mới
        await create(payload);
        notify("success", "Tạo sự kiện thành công, vui lòng chờ đợi phê duyệt");
      }

      // Xóa dữ liệu trong localStorage
      localStorage.removeItem("eventInfo");
      localStorage.removeItem("ticketAndTime");
      localStorage.removeItem("settingEvent");
      localStorage.removeItem("isEditing");

      navigate("/my-event");
    } catch (error) {
      notify("error", error?.response?.data?.message || "Có lỗi xảy ra");
    }
  };
  useEffect(() => {
    const existData = () => {
      const ticketAndTime = JSON.parse(localStorage.getItem("ticketAndTime"));
      const errorTicketAndTime = [];

      if (!ticketAndTime?.timeStart) {
        errorTicketAndTime.push("Bạn chưa nhập thời gian bắt đầu sự kiện");
      }

      if (!ticketAndTime?.timeEnd) {
        errorTicketAndTime.push("Bạn chưa nhập thời gian kết thúc sự kiện");
      }

      if (!ticketAndTime?.ticket?.length) {
        errorTicketAndTime.push("Bạn phải tạo ít nhất một loại vé");
      }

      if (errorTicketAndTime?.length > 0) {
        localStorage.setItem(
          "errorTicketAndTime",
          JSON.stringify(errorTicketAndTime)
        );
        navigate("/ticket-and-time");
      }
    }; const checkEditing = () => {
      const isEditingMode = localStorage.getItem("isEditing");
      const settingEvent = JSON.parse(localStorage.getItem("settingEvent"));
      if (isEditingMode === "true") {
        setIsEditing(true);
        if (settingEvent) {
          setPermission(String(settingEvent.permission));
          if (settingEvent.percent) {
            setPercent(settingEvent.percent);
          }
          setEventId(settingEvent.id);
        }
      }
    };

    existData();
    checkEditing();
  }, [navigate]);

  return (
    <AdminLayout>
      <Box py={4} px={"8%"}>
        <Typography textAlign={"center"} variant="h4">
          Thông tin cài đặt
        </Typography>
        <Box mt={4} width={"100%"}>
          <Paper elevation={3} width={"100%"}>
            <Box p={2}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" mb={1}>
                    Quyền riêng tư:
                  </Typography>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    row
                    value={permission}
                    onChange={(e) => setPermission(e.target.value)}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Tất cả mọi người"
                    />
                    
                  </RadioGroup>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" mb={1}>
                    Phần trăm hoa hồng:
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    value={percent}
                    onChange={(e) => setPercent(e.target.value)}
                    type="number"
                  />
                  <Typography variant="subtitle2" mt={1} color={"error"}>
                    * Phần trăm hoa hồng sẽ ảnh hưởng tới độ ưu tiên sự kiện
                    được tạo
                  </Typography>
                </Grid>
              </Grid>
            </Box>            <Box
              mt={4}
              display={"flex"}
              justifyContent={"center"}
              gap={2}
              py={2}
            >
              <ButtonCustom
                text={isEditing ? "Cập nhật sự kiện" : "Tạo sự kiện"}
                variant={"contained"}
                onClick={handleSaveEvent}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </AdminLayout>
  );
}
