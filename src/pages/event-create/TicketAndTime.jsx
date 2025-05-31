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
} from "@mui/material";
import ButtonCustom from "../../components/common/ButtonCustom";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import moment from "moment";
import { notify } from "../../utils/helpers/notify";

function TicketAndTime() {
  const navigate = useNavigate();
  const [arrComponentAddTicket, setArrComponentAddTicket] = useState([]); const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, setValue, getValues, reset } = useForm();
  const [listError, setListError] = useState([]);
  const createArray = (n) => {
    let arr = [];

    for (let i = 0; i < n; i++) {
      arr.push(i);
    }

    return arr;
  };

 const handleDateChangeStart = (index, value) => {
  const today = moment().startOf("day");
  const eventStart = moment(getValues("timeStart"));

  const selectedStart = moment(value);
 if (selectedStart.isBefore(today)){
    notify("error", "Thời gian bắt đầu bán vé ít nhất là ngày hôm nay");
    setValue(`timeTicketStart ${index}`, null);
    return;
  }

  if (!selectedStart.isBefore(eventStart)) {
    notify("error", "Thời gian bắt đầu bán vé phải trước thời gian bắt đầu sự kiện");
    setValue(`timeTicketStart ${index}`, null);
    return;
  }

  setValue(`timeTicketStart ${index}`, value);
};
const handleDateChangeEnd = (index, value) => {
  const eventEnd = moment(getValues("timeEnd"));
  const selectedEnd = moment(value);
  const selectedStart = moment(getValues(`timeTicketStart ${index}`));

  if (!selectedEnd.isSameOrAfter(selectedStart)) {
    notify("error", "Thời gian kết thúc bán vé phải bằng hoặc sau thời gian bắt đầu bán vé");
    setValue(`timeTicketEnd ${index}`, null);
    return;
  }

  if (!selectedEnd.isSameOrBefore(eventEnd)) {
    notify("error", "Thời gian kết thúc bán vé phải trước hoặc bằng thời gian kết thúc sự kiện");
    setValue(`timeTicketEnd ${index}`, null);
    return;
  }

  setValue(`timeTicketEnd ${index}`, value);
};

  useEffect(() => {
    const checkErrorEventInfo = () => {
      const eventInfo = JSON.parse(localStorage.getItem("eventInfo"));
      const errorEventInfo = [];
      if (!eventInfo?.name) {
        errorEventInfo.push("Bạn chưa nhập tên sự kiện");
      }
      if (!eventInfo?.address) {
        errorEventInfo.push("Bạn chưa nhập địa chỉ sự kiện");
      }
      if (!eventInfo?.phone) {
        errorEventInfo.push("Bạn chưa nhập số điện thoại");
      }
      if (!eventInfo?.email) {
        errorEventInfo.push("Bạn chưa nhập số email");
      }
      if (!eventInfo?.infoEvent) {
        errorEventInfo.push("Bạn chưa nhập thông tin sự kiện");
      }
      if (!eventInfo?.infoOrganize) {
        errorEventInfo.push("Bạn chưa nhập thông tin nhà tổ chức");
      }
      if (!eventInfo?.typeEvent) {
        errorEventInfo.push("Bạn chưa nhập thông tin loại sự kiện");
      }
      if (errorEventInfo?.length > 0) {
        localStorage.setItem("errorEventInfo", JSON.stringify(errorEventInfo));
        localStorage.removeItem("errorTicketAndTime");
        navigate("/event-info");
      }
    }; const existData = () => {
      const ticketAndTime = JSON.parse(localStorage.getItem("ticketAndTime"));
      const arrError = JSON.parse(localStorage.getItem("errorTicketAndTime"));
      const editingStatus = localStorage.getItem("isEditing") === "true";
      setIsEditing(editingStatus);

      if (arrError) {
        setListError(arrError);
      }

      if (ticketAndTime) {
        setValue(
          "timeStart",
          moment(ticketAndTime?.timeStart).format("YYYY-MM-DD")
        );
        setValue(
          "timeEnd",
          moment(ticketAndTime?.timeEnd).format("YYYY-MM-DD")
        );

        if (ticketAndTime?.ticket?.length > 0) {
          setArrComponentAddTicket(createArray(ticketAndTime?.ticket?.length));

          for (let i = 0; i < ticketAndTime?.ticket?.length; i++) {
            setValue(
              `timeTicketStart ${i}`,
              moment(ticketAndTime?.ticket[i]?.timeTicketStart).format(
                "YYYY-MM-DD"
              )
            );
            setValue(
              `timeTicketEnd ${i}`,
              moment(ticketAndTime?.ticket[i]?.timeTicketEnd).format("YYYY-MM-DD")
            );
            setValue(`nameTicket ${i}`, ticketAndTime?.ticket[i]?.nameTicket);
            setValue(`priceTicket ${i}`, ticketAndTime?.ticket[i]?.priceTicket);
            setValue(`totalTicket ${i}`, ticketAndTime?.ticket[i]?.totalTicket);
            setValue(`maxTicket ${i}`, ticketAndTime?.ticket[i]?.maxTicket);
            setValue(
              `descriptionTicket ${i}`,
              ticketAndTime?.ticket[i]?.descriptionTicket
            );
          }
        }
      }
    }; checkErrorEventInfo();
    existData();
  }, [navigate, setValue]);

  const ComponentAddTicket = ({ onDelete, index }) => {
    return (
      <Grid item xs={6}>
        <Paper width={"40%"} elevation={3}>
          <Box p={2}>
            <Box display={"flex"} justifyContent={"flex-end"} mt={2}>
              <Button
                color="error"
                variant="outlined"
                size="small"
                onClick={() => {
                  onDelete();
                  setValue(`timeTicketStart ${index}`, null);
                  setValue(`timeTicketEnd ${index}`, null);
                  setValue(`nameTicket ${index}`, null);
                  setValue(`priceTicket ${index}`, null);
                  setValue(`totalTicket ${index}`, null);
                  setValue(`maxTicket ${index}`, null);
                  setValue(`descriptionTicket ${index}`, null);
                }}
              >
                Xóa
              </Button>
            </Box>
            <Box mt={1}>
              <Typography variant="subtitle2">
                Thời gian bắt đầu bán vé:
              </Typography>
              <TextField
                type="date"
                size="small"
                fullWidth
                {...register(`timeTicketStart ${index}`)}
                onChange={(e) => handleDateChangeStart(index, e.target.value)}
              />
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle2">
                Thời gian ngừng bán vé:
              </Typography>
              <TextField
                type="date"
                size="small"
                fullWidth
                {...register(`timeTicketEnd ${index}`)}
                onChange={(e) => handleDateChangeEnd(index, e.target.value)}
              />
            </Box>
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Tên loại vé:</Typography>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Tên loại vé"
                    {...register(`nameTicket ${index}`)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Giá vé:</Typography>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Giá vé"
                    type="number"
                    {...register(`priceTicket ${index}`)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    Tổng số vé phát hành:
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Tổng só vé phát hành"
                    type="number"
                    {...register(`totalTicket ${index}`)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    Số vé tối đa trong 1 lần bán:
                  </Typography>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Số vé tối đa trong 1 lần bán"
                    type="number"
                    {...register(`maxTicket ${index}`)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Mô tả về vé:</Typography>
                  <TextField
                    multiline={true}
                    rows={5}
                    size="small"
                    fullWidth
                    placeholder="Mô tả về vé"
                    {...register(`descriptionTicket ${index}`)}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Grid>
    );
  };

  const handleAddComponentAddTicket = () => {
    setArrComponentAddTicket([...arrComponentAddTicket, Date.now()]);
  };

  const handleRemoveComponentAddTicket = (key) => {
    const updatedComponents = arrComponentAddTicket.filter((el) => el !== key);
    setArrComponentAddTicket(updatedComponents);
  };


  const handleContinue = (data) => {
  localStorage.setItem("ticketAndTime", JSON.stringify(data));
  localStorage.removeItem("errorTicketAndTime");
  setListError([]);
  navigate("/setting-event");
};
const handleChangeTimeStart = (value) => {
  const today = moment().startOf("day");
  let selected = moment(value);

  // Nếu ngày chọn nhỏ hơn ngày hôm nay thì đặt lại ngày hôm nay
  if (selected.isBefore(today)) {
    notify("error", "Ngày bắt đầu sự kiện phải lớn hơn hoặc bằng ngày hôm nay");
    selected = today;
  }

  const timeEnd = moment(getValues("timeEnd"));

  setValue("timeStart", selected.format("YYYY-MM-DD"));

  // Nếu ngày kết thúc đã chọn và nhỏ hơn hoặc bằng ngày bắt đầu mới thì reset ngày kết thúc
  if (timeEnd.isValid() && !timeEnd.isAfter(selected)) {
    setValue("timeEnd", selected.format("YYYY-MM-DD"));
    notify("error", "Ngày kết thúc sự kiện phải lớn hơn hoặc bằng ngày bắt đầu sự kiện");
  }
};

const handleChangeTimeEnd = (value) => {
  const timeStart = moment(getValues("timeStart"));
  let selected = moment(value);

  // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu thì đặt lại thành ngày bắt đầu
  if (selected.isBefore(timeStart)) {
    notify("error", "Ngày kết thúc sự kiện phải lớn hơn hoặc bằng ngày bắt đầu sự kiện");
    selected = timeStart;
  }

  setValue("timeEnd", selected.format("YYYY-MM-DD"));
};


  const clearLocalStorage = () => {
    localStorage.setItem("ticketAndTime", JSON.stringify({}));
    localStorage.removeItem("errorTicketAndTime");
    setListError([]);
  };

  const convertPayload = (obj) => {
    const { timeStart, timeEnd, ...rest } = obj;
    const newObj = removeNullAndEmptyProperties(rest);
    const conObj = transformObjectToArray(newObj);
    return { timeStart, timeEnd, ticket: conObj };
  };

  const removeNullAndEmptyProperties = (obj) => {
    var newObj = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] !== null && obj[key] !== "") {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  };

  const transformObjectToArray = (obj) => {
    var newArray = [];
    var newObj = {};

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        var prop = key.split(" ")[0].trim();
        var index = key.split(" ")[1].trim();

        if (!newObj[index]) {
          newObj[index] = {};
        }

        newObj[index][prop] = obj[key];
      }
    }

    for (var newIndex in newObj) {
      if (newObj.hasOwnProperty(newIndex)) {
        newArray.push(newObj[newIndex]);
      }
    }

    return newArray;
  };

  return (
    <AdminLayout>
      <Box py={4} px={"8%"}>
        <Typography textAlign={"center"} variant="h4">
          Thời gian & loại vé
        </Typography>
        <Box mt={4} width={"100%"} component={"form"}>
          <Paper width={"100%"} elevation={3}>
            <Box p={2}>
              <Stack alignItems={"center"} gap={1} mb={4}>
                {listError?.map((error, index) => (
                  <Typography variant="subtitle2" color="red" key={index}>
                    {error}
                  </Typography>
                ))}
              </Stack>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography variant="subtitle" fontWeight={"bold"}>
                  Ngày sự kiện:
                </Typography>
              </Box>
              <Box mt={4}>
                <Typography variant="subtitle2">
                  Thời gian bắt đầu sự kiện:
                </Typography>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  {...register("timeStart")}
                   onChange={(e) => handleChangeTimeStart(e.target.value)}
                />
              </Box>
              <Box mt={2}>
                <Typography variant="subtitle2">
                  Thời gian kết thúc sự kiện:
                </Typography>
                <TextField
                  type="date"
                  size="small"
                  fullWidth
                  {...register("timeEnd")}
                  onChange={(e) => handleChangeTimeEnd(e.target.value)}
                />
              </Box>
              <Box display={"flex"} justifyContent={"space-between"} mt={4}>
                <Typography variant="subtitle" fontWeight={"bold"}>
                  Loại vé:
                </Typography>
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => handleAddComponentAddTicket()}
                >
                  Thêm
                </Button>
              </Box>
              <Box mt={4}>
                <Grid container spacing={2}>
                  {arrComponentAddTicket?.map((el) => (
                    <ComponentAddTicket
                      key={el}
                      index={el}
                      onDelete={() => handleRemoveComponentAddTicket(el)}
                    />
                  ))}
                </Grid>
              </Box>
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
                color="error"
                onClick={() => {
                  reset();
                  clearLocalStorage();
                }}
              >
                Xóa
              </Button>              
             <ButtonCustom
  text={localStorage.getItem("isEditing") === "true" ? "Tiếp theo với chỉnh sửa" : "Tiếp theo"}
  variant={"contained"}
  onClick={handleSubmit((data) => {
    handleContinue(convertPayload(data));
  })}
/>

            </Box>
          </Paper>
        </Box>
      </Box>
    </AdminLayout>
  );
}

export default TicketAndTime;
