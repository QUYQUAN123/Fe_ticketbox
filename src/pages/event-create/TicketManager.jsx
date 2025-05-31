import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { getTicketStats, getEventTicketDetail } from "../../utils/api/ticket";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Alert,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  ConfirmationNumber,
  MonetizationOn,
  Event,
  VisibilityOutlined,
} from "@mui/icons-material";

const TicketManager = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetail, setEventDetail] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchTicketStats();
  }, []);

  const fetchTicketStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTicketStats();
      setStatsData(response.data);
    } catch (err) {
      setError("Không thể tải dữ liệu thống kê vé. Vui lòng thử lại sau.");
      console.error("Error fetching ticket stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetail = async (eventId) => {
    setDetailLoading(true);
    try {
      const response = await getEventTicketDetail(eventId);
      setEventDetail(response.data);
      setOpenDetailDialog(true);
    } catch (err) {
      console.error("Error fetching event detail:", err);
    } finally {
      setDetailLoading(false);
    }
  };
  const approvedCount =
    statsData && statsData.allStats
      ? statsData.allStats.filter((item) => item.isApprove === 1).length
      : 0;

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setEventDetail(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const renderTopSellingEvents = () => {
    if (
      !statsData ||
      !statsData.topSelling ||
      statsData.topSelling.length === 0
    ) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            Không có dữ liệu
          </TableCell>
        </TableRow>
      );
    }

    return statsData.topSelling.map((event, index) => (
      <TableRow hover key={event._id}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={event.eventImage}
              alt={event.eventName}
              variant="rounded"
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {event.eventName}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="center">
          {formatDate(event.timeStart)} - {formatDate(event.timeEnd)}
        </TableCell>
        <TableCell align="center">{event.totalTickets || 0}</TableCell>
        <TableCell align="right">
          {formatCurrency(event.totalAmount || 0)}
        </TableCell>
        <TableCell align="center">
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityOutlined />}
            onClick={() => fetchEventDetail(event._id)}
          >
            Chi tiết
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  const renderLowestSellingEvents = () => {
    if (
      !statsData ||
      !statsData.lowestSelling ||
      statsData.lowestSelling.length === 0
    ) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            Không có dữ liệu
          </TableCell>
        </TableRow>
      );
    }

    return statsData.lowestSelling.map((event, index) => (
      <TableRow hover key={event._id}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={event.eventImage}
              alt={event.eventName}
              variant="rounded"
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {event.eventName}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="center">
          {formatDate(event.timeStart)} - {formatDate(event.timeEnd)}
        </TableCell>
        <TableCell align="center">{event.totalTickets || 0}</TableCell>
        <TableCell align="right">
          {formatCurrency(event.totalAmount || 0)}
        </TableCell>
        <TableCell align="center">
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityOutlined />}
            onClick={() => fetchEventDetail(event._id)}
          >
            Chi tiết
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  const renderAllEvents = () => {
    if (!statsData || !statsData.allStats || statsData.allStats.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            Không có dữ liệu
          </TableCell>
        </TableRow>
      );
    }

    return statsData.allStats.map((event, index) => (
      <TableRow hover key={event._id}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={event.eventImage}
              alt={event.eventName}
              variant="rounded"
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              {event.eventName}
            </Typography>
          </Box>
        </TableCell>
        <TableCell align="center">
          {formatDate(event.timeStart)} - {formatDate(event.timeEnd)}
        </TableCell>
        <TableCell align="center">{event.totalTickets || 0}</TableCell>
        <TableCell align="right">
          {formatCurrency(event.totalAmount || 0)}
        </TableCell>
        <TableCell align="center">
          <Button
            variant="outlined"
            size="small"
            startIcon={<VisibilityOutlined />}
            onClick={() => fetchEventDetail(event._id)}
          >
            Chi tiết
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  const renderTicketDetailTable = () => {
    if (
      !eventDetail ||
      !eventDetail.ticketDetails ||
      eventDetail.ticketDetails.length === 0
    ) {
      return (
        <TableRow>
          <TableCell colSpan={6} align="center">
            Không có dữ liệu vé
          </TableCell>
        </TableRow>
      );
    }

    return eventDetail.ticketDetails.map((ticket, index) => (
      <TableRow key={index}>
        <TableCell>{ticket.name}</TableCell>
        <TableCell align="right">{formatCurrency(ticket.price)}</TableCell>
        <TableCell align="center">{ticket.total}</TableCell>
        <TableCell align="center">{ticket.sold}</TableCell>
        <TableCell align="center">{ticket.remainingTickets}</TableCell>
        <TableCell align="right">{formatCurrency(ticket.revenue)}</TableCell>
      </TableRow>
    ));
  };

  const renderEventDetailDialog = () => {
    if (!eventDetail) return null;

    return (
      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              src={eventDetail.eventImage}
              alt={eventDetail.eventName}
              variant="rounded"
              sx={{ width: 50, height: 50, mr: 2 }}
            />
            <Typography variant="h6">{eventDetail.eventName}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng vé có sẵn
                  </Typography>
                  <Typography variant="h5">
                    {eventDetail.totalAvailableTickets}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Vé đã bán
                  </Typography>
                  <Typography variant="h5">
                    {eventDetail.totalSoldTickets}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Doanh thu
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(eventDetail.totalRevenue)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Tỷ lệ bán
                  </Typography>
                  <Typography variant="h5">
                    {eventDetail.soldPercentage
                      ? eventDetail.soldPercentage.toFixed(1)
                      : 0}
                    %
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>
            Chi tiết loại vé
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên vé</TableCell>
                  <TableCell align="right">Giá vé</TableCell>
                  <TableCell align="center">Tổng số</TableCell>
                  <TableCell align="center">Đã bán</TableCell>
                  <TableCell align="center">Còn lại</TableCell>
                  <TableCell align="right">Doanh thu</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{renderTicketDetailTable()}</TableBody>
            </Table>
          </TableContainer>

          {eventDetail.transactionHistory &&
            eventDetail.transactionHistory.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Lịch sử giao dịch ({eventDetail.transactionCount})
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Người mua</TableCell>
                        <TableCell>Loại vé</TableCell>
                        <TableCell align="center">Số lượng</TableCell>
                        <TableCell align="right">Thành tiền</TableCell>
                        <TableCell align="right">Ngày mua</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {eventDetail.transactionHistory
                        .slice(0, 5)
                        .map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {transaction.user || "Không xác định"}
                            </TableCell>
                            <TableCell>{transaction.ticketName}</TableCell>
                            <TableCell align="center">
                              {transaction.quantity}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(transaction.amount)}
                            </TableCell>
                            <TableCell align="right">
                              {formatDate(transaction.date)}
                            </TableCell>
                          </TableRow>
                        ))}
                      {eventDetail.transactionHistory.length > 5 && (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography variant="body2" color="textSecondary">
                              Hiển thị 5/{eventDetail.transactionHistory.length}{" "}
                              giao dịch
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={fetchTicketStats}>
            Thử lại
          </Button>
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Thống kê vé sự kiện
        </Typography>

        {statsData && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent sx={{ display: "flex", alignItems: "center" }}>
                    <Event sx={{ fontSize: 40, mr: 2, color: "#1976d2" }} />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Tổng số sự kiện
                      </Typography>
                      <Typography
                        variant="h4"
                        component="div"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        {statsData.totalEvents}
                        <Typography
                          variant="subtitle2"
                          component="span"
                          sx={{ ml: 1, color: "text.secondary" }}
                        >
                          Đã Duyệt {approvedCount}
                        </Typography>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent sx={{ display: "flex", alignItems: "center" }}>
                    <ConfirmationNumber
                      sx={{ fontSize: 40, mr: 2, color: "#2e7d32" }}
                    />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Tổng vé đã bán
                      </Typography>
                      <Typography variant="h4">
                        {statsData.allStats.reduce(
                          (total, event) => total + (event.totalTickets || 0),
                          0
                        )}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card>
                  <CardContent sx={{ display: "flex", alignItems: "center" }}>
                    <MonetizationOn
                      sx={{ fontSize: 40, mr: 2, color: "#ed6c02" }}
                    />
                    <Box>
                      <Typography color="textSecondary" gutterBottom>
                        Tổng doanh thu
                      </Typography>
                      <Typography variant="h4">
                        {formatCurrency(
                          statsData.allStats.reduce(
                            (total, event) => total + (event.totalAmount || 0),
                            0
                          )
                        )}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ mb: 3 }}
            >
              <Tab
                icon={<TrendingUp />}
                label="VÉ BÁN CHẠY NHẤT"
                iconPosition="start"
              />
              <Tab
                icon={<TrendingDown />}
                label="VÉ BÁN ÍT NHẤT"
                iconPosition="start"
              />
              <Tab
                icon={<Event />}
                label="TẤT CẢ SỰ KIỆN"
                iconPosition="start"
              />
            </Tabs>

            <Box sx={{ mb: 3 }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell sx={{ width: 200 }}>
                        Tên sự kiện
                      </TableCell>{" "}
                      <TableCell align="center" sx={{ width: 250 }}>
                        Thời gian
                      </TableCell>{" "}
                      <TableCell align="center">Số vé đã bán</TableCell>
                      <TableCell align="right">Doanh thu</TableCell>
                      <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tabValue === 0 && renderTopSellingEvents()}
                    {tabValue === 1 && renderLowestSellingEvents()}
                    {tabValue === 2 && renderAllEvents()}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </>
        )}

        {renderEventDetailDialog()}
      </Box>
    </AdminLayout>
  );
};

export default TicketManager;
