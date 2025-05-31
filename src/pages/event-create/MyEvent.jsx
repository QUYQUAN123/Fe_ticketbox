import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { myEvent, removeEvent } from "../../utils/api/event";
import ModalUpdate from "../../components/common/ModalUpdate";
import { listTypeEvent } from "../../contstant";
import { notify } from "../../utils/helpers/notify";
import { formatCurrency } from "../../utils/helpers/formatCurrency";
import { useNavigate } from "react-router-dom";

export default function MyEvent() {
  const navigate = useNavigate();
  const [listEvent, setListEvent] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [infoEvent, setInfoEvent] = useState({});
  const [infoTicket, setInfoTicket] = useState({});
  const columns = [
    {
      field: "image",
      headerName: "Hình ảnh",
      width: 150,
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => (
        <Box
          component={"img"}
          src={params?.row?.image}
          width={120}
          height={100}
          sx={{ objectFit: "cover", borderRadius: 1 }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Tên sự kiện",
      width: 120,
      flex: 0.5,
      minWidth: 120
    },
    {
      field: "address",
      headerName: "Địa điểm",
      width: 120,
      flex: 0.5,
      minWidth: 120
    },
    {
      field: "typeEvent",
      headerName: "Loại sự kiện",
      width: 150,
      flex: 0.7,
      minWidth: 130,
      valueGetter: (params) => {
        return listTypeEvent[params.value - 1].label;
      },
    },
    {
      field: "isApprove",
      headerName: "Trạng thái",
      width: 140,
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => {
        const label =
          params?.row?.isApprove === 0
            ? "Chưa phê duyệt"
            : "Đã phê duyệt";
        const color = params?.row?.isApprove === 0 ? "error" : "success";
        return <Chip label={label} color={color} />;
      },
    },
    {
      field: "",
      headerName: "Hành động",
      width: 230,
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Box display={"flex"} gap={1} flexWrap="wrap">
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDetail(params.row)}
          >
            Chi tiết
          </Button>
          {params?.row?.isApprove === 0 && (
            <>
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => handleEdit(params.row)}
              >
                Sửa
              </Button>
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={() => handeleDelete(params.row?.id)}
              >
                Xóa
              </Button>
            </>
          )}
        </Box>
      ),
    },
  ];
  const handleDetail = (data) => {
    setInfoEvent(data);
    setInfoTicket(JSON?.parse(data?.ticket));
    setIsOpen(true);
  }; const handleEdit = (data) => {
    // Lưu thông tin sự kiện vào localStorage để có thể chỉnh sửa
    const eventInfo = {
      name: data.name,
      address: data.address,
      phone: data.phone,
      email: data.email,
      infoEvent: data.infoEvent,
      infoOrganize: data.infoOrganize,
      typeEvent: data.typeEvent,
      image: data.image,
      seatingChart: data.seatingChart,
      id: data.id // Lưu ID để biết đây là sự kiện đang được chỉnh sửa
    };

    // Lưu thông tin sự kiện vào localStorage
    localStorage.setItem("eventInfo", JSON.stringify(eventInfo));

    // Lưu thông tin thời gian và vé vào localStorage
    const ticketAndTime = {
      timeStart: data.timeStart,
      timeEnd: data.timeEnd,
      ticket: JSON.parse(data.ticket)
    };
    localStorage.setItem("ticketAndTime", JSON.stringify(ticketAndTime));
    // Lưu thông tin cài đặt vào localStorage
    const settingEvent = {
      permission: data.permission,
      percent: data.percent,
      id: data.id
    };
    localStorage.setItem("settingEvent", JSON.stringify(settingEvent));

    // Đánh dấu là đang trong chế độ chỉnh sửa
    localStorage.setItem("isEditing", "true");

    // Chuyển hướng đến trang thông tin sự kiện để bắt đầu quy trình chỉnh sửa
    navigate("/event-info");
  };

  const handeleDelete = async (id) => {
    try {
      await removeEvent(id);
      getListData();
      notify("success", "Xóa sự kiện thành công");
    } catch (error) { }
  };

  const handleClear = (data) => {
    setInfoEvent([]);
    setInfoTicket({});
    setIsOpen(false);
  };

  const getListData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await myEvent(user?._id);
      setListEvent(res.data?.map((i) => ({ id: i._id, ...i })));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getListData();
  }, []);

  return (
    <AdminLayout>
      <Box py={4} px={"8%"}>
        <Typography textAlign={"center"} variant="h4">
          Sự kiện của tôi
        </Typography>
        <Box mt={4} width={"100%"}>          <Paper elevation={3} width={"100%"}>
          <Box p={2}>
            <DataGrid
              rows={listEvent}
              columns={columns}
              rowHeight={150}
              autoHeight
              disableColumnMenu
              disableRowSelectionOnClick
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 }
                }
              }}
              pageSizeOptions={[5, 10, 20]}
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
                '& .MuiDataGrid-columnHeader:focus': {
                  outline: 'none',
                },
                width: '100%',
                overflowX: 'auto'
              }}
            />
          </Box>
        </Paper>
        </Box>
      </Box>
      <ModalUpdate
        open={isOpen}
        showCancel={false}
        title={"Chi tiết sự kiện"}
        titleOk={"Đóng"}
        handleClose={handleClear}
        handleOk={handleClear}
        maxWidth={"md"}
      >
        <Stack alignItems={"center"}>
          <Box
            src={infoEvent?.image}
            component={"img"}
            width={400}
            height={200}
            sx={{ objectFit: "cover", borderRadius: 2 }}
          />
        </Stack>
        <Box mt={4}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Tên sự kiện: {infoEvent?.name}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Địa điểm tổ chức: {infoEvent?.address}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Ngày bắt đầu: {infoEvent?.timeStart}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Ngày kết thúc: {infoEvent?.timeEnd}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Email: {infoEvent?.email}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Số điện thoại: {infoEvent?.phone}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Loại sự kiện: {listTypeEvent[infoEvent?.typeEvent - 1]?.label}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Trạng thái phê duyệt:{" "}
                {infoEvent?.isApprove === 0
                  ? "Chưa được phê duyệt"
                  : "Đã được phê duyệt"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle2">
                Quyền riêng tư:{" "}
                {infoEvent?.permission === 0 ? "Riêng tư" : "Công khai"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">
                Thông tin sự kiện: {infoEvent?.infoEvent}
              </Typography>
            </Grid>            <Grid item xs={12}>
              <Typography variant="subtitle2">
                Thông tin nhà tổ chức: {infoEvent?.infoOrganize}
              </Typography>
            </Grid>
            {infoEvent?.seatingChart && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" mb={2}>
                  Sơ đồ chỗ ngồi:
                </Typography>
                <Box display="flex" justifyContent="center">
                  <Box
                    component="img"
                    src={infoEvent.seatingChart}
                    alt="Sơ đồ chỗ ngồi"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "400px",
                      objectFit: "contain",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0"
                    }}
                  />
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant="subtitle2" mb={2}>
                Thông tin vé:
              </Typography>
              {infoTicket?.length > 0 && (
                <Grid container spacing={4}>
                  {infoTicket?.map((ticket, index) => (
                    <Grid item xs={6} key={index}>
                      <Paper elevation={3}>
                        <Box p={2}>
                          <Typography variant="subtitle2">
                            Ngày mở bán: {ticket?.timeTicketStart}
                          </Typography>
                          <Typography variant="subtitle2" mt={1}>
                            Ngày đóng bán: {ticket?.timeTicketEnd}
                          </Typography>
                          <Typography variant="subtitle2" mt={1}>
                            Tên vé: {ticket?.nameTicket}
                          </Typography>
                          <Typography variant="subtitle2" mt={1}>
                            Mô tả vé : {ticket?.descriptionTicket}
                          </Typography>                          <Typography variant="subtitle2" mt={1}>
                            Giá vé : {formatCurrency(ticket?.priceTicket)}
                          </Typography>
                          <Typography variant="subtitle2" mt={1}>
                            Tổng số vé phát hành : {ticket?.totalTicket}
                          </Typography>
                          <Typography variant="subtitle2" mt={1}>
                            Số lượt mua tối đa trong 1 lần : {ticket?.maxTicket}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Box>
      </ModalUpdate>
    </AdminLayout>
  );
}
