import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import ButtonCustom from "../../components/common/ButtonCustom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../utils/firebase";
import { notify } from "../../utils/helpers/notify";
import { useNavigate } from "react-router-dom";
import { listTypeEvent } from "../../contstant/event";

export default function EventInfo() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [infoEvent, setInfoEvent] = useState("");
  const [infoOrganize, setInfoOrganize] = useState(""); const [typeEvent, setTypeEvent] = useState("");
  const [image, setImage] = useState("");
  const [seatingChart, setSeatingChart] = useState(""); const [isLoading, setIsLoading] = useState(false);
  const [listError, setListError] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  function handleUpload(event) {
    setIsLoading(true);
    const file = event.target.files[0];

    if (!file) {
      notify("warn", "Vui lòng chọn tấm ảnh để upload");
    }

    const storageRef = ref(storage, `/files/${file.name + Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => { },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImage(url);
        });
      }
    );
    event.target.value = null;
    setIsLoading(false);
  }

  function handleUploadSeatingChart(event) {
    setIsLoading(true);
    const file = event.target.files[0];

    if (!file) {
      notify("warn", "Vui lòng chọn tấm ảnh để upload");
      setIsLoading(false);
      return;
    }

    const storageRef = ref(storage, `/files/seating-chart-${file.name + Date.now()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => { },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setSeatingChart(url);
        });
      }
    );
    event.target.value = null;
    setIsLoading(false);
  }
  const saveLocalStorage = () => {
    const obj = {
      name,
      address,
      phone,
      email,
      infoEvent,
      infoOrganize,
      typeEvent,
      image,
      seatingChart,
    };
    localStorage.setItem("eventInfo", JSON.stringify(obj));
    localStorage.removeItem("errorEventInfo");
    setListError([]);
  };

  const clearLocalStorage = () => {
    localStorage.setItem("eventInfo", JSON.stringify({}));
    localStorage.removeItem("errorEventInfo");
    setListError([]);
  };
  useEffect(() => {
    const existData = () => {
      const eventInfo = JSON.parse(localStorage.getItem("eventInfo"));
      const arrError = JSON.parse(localStorage.getItem("errorEventInfo"));
      const isEditingMode = localStorage.getItem("isEditing") === "true";

      setIsEditing(isEditingMode);

      if (arrError) {
        setListError(arrError);
      } if (eventInfo) {
        setName(eventInfo?.name);
        setAddress(eventInfo?.address);
        setPhone(eventInfo?.phone);
        setEmail(eventInfo?.email);
        setInfoEvent(eventInfo?.infoEvent);
        setInfoOrganize(eventInfo?.infoOrganize);
        setTypeEvent(eventInfo?.typeEvent);
        setImage(eventInfo?.image);
        setSeatingChart(eventInfo?.seatingChart);
      }
    };
    existData();
  }, []);

  return (
    <AdminLayout>
      <Box py={4} px={"8%"}>
        <Typography textAlign={"center"} variant="h4">
          Thông tin sự kiện
        </Typography>
        <Box mt={4} width={"100%"}>
          <Paper elevation={3} width={"100%"}>
            <Box p={2}>
              <Stack alignItems={"center"} gap={1} mb={4}>
                {listError?.map((error, index) => (
                  <Typography variant="subtitle2" color="red" key={index}>
                    {error}
                  </Typography>
                ))}
              </Stack>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" mb={1}>
                    Tên sự kiện:
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Nhập tên sự kiện ..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" mb={1}>
                    Nhập địa điểm sự kiện:
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Nhập địa điểm sự kiện ..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" mb={1}>
                    Số điện thoại:
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Nhập số điện thoại ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" mb={1}>
                    Email:
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Nhập email ..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" mb={1}>
                    Thông tin sự kiện:
                  </Typography>
                  <TextField
                    multiline={true}
                    rows={5}
                    fullWidth
                    size="small"
                    placeholder="Nhập tin sự kiện ..."
                    value={infoEvent}
                    onChange={(e) => setInfoEvent(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" mb={1}>
                    Thông tin nhà tổ chức
                  </Typography>
                  <TextField
                    multiline={true}
                    rows={5}
                    fullWidth
                    size="small"
                    placeholder="Nhập thông tin nhà tổ chức ..."
                    value={infoOrganize}
                    onChange={(e) => setInfoOrganize(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  {image ? (
                    <>
                      <Typography variant="subtitle2" mb={1}>
                        Ảnh sự kiện:
                      </Typography>
                      <Box display={"flex"} alignItems={"center"} gap={2}>
                        <Box
                          component={"img"}
                          src={image}
                          width={200}
                          height={200}
                          sx={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => setImage("")}
                        >
                          Xóa
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Typography variant="subtitle2" mb={1}>
                        Ảnh nền sự kiện:
                      </Typography>
                      <TextField
                        type="file"
                        placeholder="Upload ảnh sự kiện"
                        size="small"
                        fullWidth
                        onChange={handleUpload}
                        accept="image/png, image/gif, image/jpeg"
                        multiline={false}
                      />
                    </>
                  )}                </Grid>
                <Grid item xs={6}>
                  {seatingChart ? (
                    <>
                      <Typography variant="subtitle2" mb={1}>
                        Sơ đồ chỗ ngồi:
                      </Typography>
                      <Box display={"flex"} alignItems={"center"} gap={2}>
                        <Box
                          component={"img"}
                          src={seatingChart}
                          width={200}
                          height={200}
                          sx={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => setSeatingChart("")}
                        >
                          Xóa
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Typography variant="subtitle2" mb={1}>
                        Sơ đồ chỗ ngồi (tùy chọn):
                      </Typography>
                      <TextField
                        type="file"
                        placeholder="Upload sơ đồ chỗ ngồi"
                        size="small"
                        fullWidth
                        onChange={handleUploadSeatingChart}
                        accept="image/png, image/gif, image/jpeg"
                        multiline={false}
                      />
                    </>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" mb={1}>
                    Loại sự kiện:
                  </Typography>
                  <Select
                    fullWidth
                    value={typeEvent}
                    onChange={(e) => setTypeEvent(e.target.value)}
                    size="small"
                  >
                    {listTypeEvent?.map((t) => (
                      <MenuItem value={t.value}>{t.label}</MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Box>
            <Box
              mt={4}
              display={"flex"}
              justifyContent={"center"}
              gap={2}
              py={2}
            >              <Button
              variant="contained"
              disabled={isLoading}
              onClick={() => {
                setName("");
                setAddress("");
                setPhone("");
                setEmail("");
                setInfoEvent("");
                setInfoOrganize("");
                setImage("");
                setSeatingChart("");
                setInfoOrganize("");
                clearLocalStorage();
              }}
              color="error"
            >
                Xóa thông tin
              </Button><ButtonCustom
                text={isEditing ? "Tiếp theo với chỉnh sửa" : "Tiếp theo"}
                variant={"contained"}
                disabled={isLoading}
                onClick={() => {
                  saveLocalStorage();
                  navigate("/ticket-and-time");
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </AdminLayout>
  );
}
