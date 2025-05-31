import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Grid, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { list } from "../../utils/api/payment";
import { formatCurrency } from "../../utils/helpers/formatCurrency";

export default function AdminRevenue() {
  const [listPayment, setListPayment] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);

  // Filter states
  const [filterType, setFilterType] = useState('all'); // 'all', 'month', 'quarter'
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedQuarter, setSelectedQuarter] = useState(Math.ceil((moment().month() + 1) / 3));
  const [selectedYear, setSelectedYear] = useState(moment().year());

  // Generate years for dropdown (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => moment().year() - i);

  // List of months
  const months = [
    { value: 1, label: 'Tháng 1' },
    { value: 2, label: 'Tháng 2' },
    { value: 3, label: 'Tháng 3' },
    { value: 4, label: 'Tháng 4' },
    { value: 5, label: 'Tháng 5' },
    { value: 6, label: 'Tháng 6' },
    { value: 7, label: 'Tháng 7' },
    { value: 8, label: 'Tháng 8' },
    { value: 9, label: 'Tháng 9' },
    { value: 10, label: 'Tháng 10' },
    { value: 11, label: 'Tháng 11' },
    { value: 12, label: 'Tháng 12' }
  ];

  // List of quarters
  const quarters = [
    { value: 1, label: 'Quý 1 (Tháng 1-3)' },
    { value: 2, label: 'Quý 2 (Tháng 4-6)' },
    { value: 3, label: 'Quý 3 (Tháng 7-9)' },
    { value: 4, label: 'Quý 4 (Tháng 10-12)' }
  ];

  // Function to filter payments based on selected criteria
  const applyFilter = useCallback(() => {
    if (filterType === 'all') {
      setFilteredPayments(listPayment);
      return;
    }

    const filtered = listPayment.filter(payment => {
      const paymentDate = moment(payment.createdAt);
      const paymentMonth = paymentDate.month() + 1; // moment months are 0-indexed
      const paymentYear = paymentDate.year();

      if (filterType === 'month') {
        return paymentMonth === selectedMonth && paymentYear === selectedYear;
      } else if (filterType === 'quarter') {
        const paymentQuarter = Math.ceil(paymentMonth / 3);
        return paymentQuarter === selectedQuarter && paymentYear === selectedYear;
      }

      return true; // Default case
    });

    setFilteredPayments(filtered);
  }, [filterType, listPayment, selectedMonth, selectedQuarter, selectedYear]);

  // Apply filters when filter parameters change
  useEffect(() => {
    if (listPayment.length > 0) {
      applyFilter();
    }
  }, [filterType, selectedMonth, selectedQuarter, selectedYear, listPayment, applyFilter]);
  const columns = [
    {
      field: "nameEvent",
      headerName: "Tên sự kiện",
      width: 120,
      renderCell: (params) => params.row?.event?.name,
    },
    {
      field: "name",
      headerName: "Loại vé",
      width: 100,
    }, {
      field: "price",
      headerName: "Mệnh giá",
      width: 120,
      valueGetter: (params) => {
        return formatCurrency(params.value);
      },
    },
    {
      field: "number",
      headerName: "Số lượng",
      width: 80,
    }, {
      field: "amount",
      headerName: "Thanh toán",
      width: 120,
      valueGetter: (params) => {
        return formatCurrency(params.value);
      },
    },
    {
      field: "event",
      headerName: "Người Tổ chức",
      width: 120,
      valueGetter: (params) => {
        return params.value?.owner?.name;
      },
    },
    {
      field: "user",
      headerName: "Người đặt",
      width: 120,
      valueGetter: (params) => {
        return params.value?.name;
      },
    },
    {
      field: "createdAt",
      headerName: "Thời gian thanh toán",
      width: 180,
      valueGetter: (params) => {
        return moment(params.value).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      field: "",
      headerName: "Hoa hồng",
      width: 100,
      renderCell: (params) => (
        <Typography>{params.row?.event?.percent + "%"}</Typography>
      ),
    },

    {
      field: "name1",
      headerName: "Thu",
      width: 120,
      renderCell: (params) => (
        <Typography variant="subtitle2">
          {(
            (Number(params.row.amount) * Number(params.row.event?.percent)) /
            100
          ).toLocaleString("vi-VN") + " VNĐ"}
        </Typography>
      ),
    },
  ];
  useEffect(() => {
    const getPayment = async () => {
      try {
        const res = await list();
        const payments = res.data?.map((i) => ({ id: i?._id, ...i }));
        setListPayment(payments);
        setFilteredPayments(payments); // Initially set filtered payments to all payments
      } catch (error) { }
    };
    getPayment();
  }, []);

  return (
    <AdminLayout>
      <Box py={4} px={"8%"}>
        <Typography textAlign={"center"} variant="h4">
          Doanh thu
        </Typography>
        <Box mt={4} width={"100%"}>
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="filter-type-label">Loại lọc</InputLabel>
                <Select
                  labelId="filter-type-label"
                  value={filterType}
                  label="Loại lọc"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="month">Theo tháng</MenuItem>
                  <MenuItem value="quarter">Theo quý</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {filterType === 'month' && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="month-label">Tháng</InputLabel>
                  <Select
                    labelId="month-label"
                    value={selectedMonth}
                    label="Tháng"
                    onChange={(e) => setSelectedMonth(e.target.value)}
                  >
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
            {filterType === 'quarter' && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="quarter-label">Quý</InputLabel>
                  <Select
                    labelId="quarter-label"
                    value={selectedQuarter}
                    label="Quý"
                    onChange={(e) => setSelectedQuarter(e.target.value)}
                  >
                    {quarters.map((quarter) => (
                      <MenuItem key={quarter.value} value={quarter.value}>
                        {quarter.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}            {(filterType === 'month' || filterType === 'quarter') && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel id="year-label">Năm</InputLabel>
                  <Select
                    labelId="year-label"
                    value={selectedYear}
                    label="Năm"
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

          </Grid>

          {/* Revenue Stats Summary */}
          <Paper elevation={3} sx={{ mb: 2, p: 2 }}>
            <Typography variant="h6">
              Tổng doanh thu: {formatCurrency(
                filteredPayments.reduce((sum, payment) => {
                  const revenue = (Number(payment.amount) * Number(payment.event?.percent)) / 100;
                  return sum + revenue;
                }, 0)
              )}
            </Typography>
            <Typography variant="body1">
              Số lượng giao dịch: {filteredPayments.length}
            </Typography>
          </Paper>

          {/* DataGrid */}
          <Paper elevation={3} width={"100%"}>
            <Box p={2} height={"50vh"}>
              <DataGrid rows={filteredPayments} columns={columns} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </AdminLayout>
  );
}
