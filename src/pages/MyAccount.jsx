import React, { useEffect, useState } from "react";
import AdminLayout from "../components/layout/AdminLayout";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import { notify } from "../utils/helpers/notify";
import { findUser, update } from "../utils/api/user";

export default function EventInfo() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [sex, setSex] = useState("1");

  const [isLoading, setIsLoading] = useState(false);

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
      (snapshot) => {},
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

  const hanldeUpdate = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await update(user?._id, {
        image,
        name,
        phone,
        email,
        sex,
      });
      notify("success", "Cập nhật thông tin thành công");
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const res = await findUser(user?._id);
        setImage(res?.data?.image);
        setName(res?.data?.name);
        setPhone(res?.data?.phone);
        setEmail(res?.data?.email);
        setSex(res?.data?.sex);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <AdminLayout>
      <Box py={4} px={"8%"}>
        <Typography textAlign={"center"} variant="h4">
          Cập nhật thông tin
        </Typography>
        <Box mt={4} width={"100%"}>
          <Paper elevation={3} width={"100%"}>
            <Box p={2}>
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  {image ? (
                    <>
                      <Typography variant="subtitle2" mb={1}>
                        Ảnh đại diện:
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
                        Ảnh đại diện:
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
                  )}
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" mb={1}>
                    Họ tên:
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
                    Số điện thoại:
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Nhập số điện thoại ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled
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
                <Grid item xs={12}>
                  <Typography variant="subtitle2" mb={1}>
                    Giới tính:
                  </Typography>
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    row
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Nam"
                    />
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="Nữ"
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
            </Box>
            <Box
              mt={4}
              display={"flex"}
              justifyContent={"center"}
              gap={2}
              py={2}
            >
              <Button
                variant="contained"
                disabled={isLoading}
                color="primary"
                onClick={hanldeUpdate}
              >
                Cập nhật thông tin
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </AdminLayout>
  );
}
