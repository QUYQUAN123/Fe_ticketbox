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
import { approveEvent, listApproveEvent } from "../../utils/api/event";
import ModalUpdate from "../../components/common/ModalUpdate";
import { notify } from "../../utils/helpers/notify";
import { listTypeEvent } from "../../contstant";

export default function ApproveEvent() {
  const [listEvent, setListEvent] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [infoEvent, setInfoEvent] = useState({});
  const [infoTicket, setInfoTicket] = useState({});

  const columns = [
    {
      field: "image",
      headerName: "Hình ảnh",
      width: 170,
      renderCell: (params) => (
        <Box
          component={"img"}
          src={params?.row?.image}
          width={150}
          height={120}
          sx={{ objectFit: "cover", borderRadius: 1 }}
        />
      ),
    },
    { field: "name", headerName: "Tên sự kiện", width: 200 },
    // { field: "address", headerName: "Địa điểm tổ chức", width: 150 },
    {
      field: "typeEvent",
      headerName: "Loại sự kiện",
      width: 150,
      valueGetter: (params) => {
        return listTypeEvent[params.value - 1].label;
      },
    },
    {
      field: "isApprove",
      headerName: "Trạng thái",
      width: 200,
      renderCell: (params) => {
        const label =
          params?.row?.isApprove === 0
            ? "Chưa được phê duyệt"
            : "Đã được phê duyệt";
        const color = params?.row?.isApprove === 0 ? "error" : "success";
        return <Chip label={label} color={color} />;
      },
    },
    {
      field: "",
      headerName: "Hành động",
      width: 250,
      renderCell: (params) => (
        <Box display={"flex"} gap={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDetail(params.row)}
          >
            Chi tiết
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleApproveEvent(params.row?._id)}
          >
            Phê duyệt
          </Button>
        </Box>
      ),
    },
  ];

  const handleApproveEvent = async (id) => {
    try {
      await approveEvent(id);
      await getListData();
      notify("success", "Phê duyệt sự kiện thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDetail = (data) => {
    setInfoEvent(data);
    setInfoTicket(JSON?.parse(data?.ticket));
    setIsOpen(true);
  };

  const handleClear = (data) => {
    setInfoEvent([]);
    setInfoTicket({});
    setIsOpen(false);
  };

  const getListData = async () => {
    try {
      const res = await listApproveEvent();
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
          Phê duyệt sự kiện
        </Typography>
        <Box mt={4} width={"100%"}>
          <Paper elevation={3} width={"100%"}>
            <Box p={2} height={"60vh"}>
              <DataGrid rows={listEvent} columns={columns} rowHeight={150} />
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
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">
                Thông tin nhà tổ chức: {infoEvent?.infoOrganize}
              </Typography>
            </Grid>
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
                          </Typography>
                          <Typography variant="subtitle2" mt={1}>
                            Giá vé : {ticket?.priceTicket}
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
