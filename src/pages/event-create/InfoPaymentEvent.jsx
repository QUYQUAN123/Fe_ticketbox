import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Box, Typography, Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getByUserId } from "../../utils/api/payment";
import { formatCurrency } from "../../utils/helpers/formatCurrency";
import moment from "moment";

export default function InfoPaymentEvent() {
  const [listPayment, setListPayment] = useState([]);
  const [user, setUser] = useState({});
  const columns = [
    {
      field: "",
      headerName: "Tên sự kiện",
      width: 200,
      renderCell: (params) => params.row?.event?.name,
    },
    {
      field: "name",
      headerName: "Loại vé",
      width: 150,
    }, {
      field: "price",
      headerName: "Mệnh giá",
      width: 150,
      valueGetter: (params) => {
        return formatCurrency(params.value);
      },
    },
    {
      field: "number",
      headerName: "Số lượng",
      width: 150,
    }, {
      field: "amount",
      headerName: "Thanh toán",
      width: 150,
      valueGetter: (params) => {
        return formatCurrency(params.value);
      },
    },
    {
      field: "createdAt",
      headerName: "Thời gian thanh toán",
      width: 250,
      valueGetter: (params) => {
        return moment(params.value).format("DD/MM/YYYY HH:mm:ss");
      },
    },
  ];

  const getListData = async () => {
    try {
      const res = await getByUserId(user?._id);
        console.log("Dữ liệu thanh toán:", res.data); 
      setListPayment(res.data?.map((i) => ({ id: i._id, ...i })));
     
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    user?._id && getListData();
  }, [user]);

  useEffect(() => {
    const getData = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
    };
    getData();

  }, []);

  return (
    <AdminLayout>
      <Box py={4} px={"8%"}>
        <Typography textAlign={"center"} variant="h4">
          Lịch sử thanh toán
        </Typography>
        <Box mt={4} width={"100%"}>
          <Paper elevation={3} width={"100%"}>
            <Box p={2} height={"50vh"}>
              <DataGrid rows={listPayment} columns={columns} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </AdminLayout>
  );
}
