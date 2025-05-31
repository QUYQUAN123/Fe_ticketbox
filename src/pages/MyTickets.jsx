import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  Container,
  IconButton,
  Grid,
  Stack
} from '@mui/material';
import SideBarAdmin from '../components/layout/sidebar/SideBarAdmin';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import EventIcon from '@mui/icons-material/Event';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { getByUserId } from '../utils/api/payment';
import { getListEventById } from '../utils/api/event';
import { formatCurrency } from '../utils/helpers/formatCurrency';
import ModalUpdate from '../components/common/ModalUpdate';
import { listTypeEvent } from '../contstant';

function TabPanel(props) {
  const { children, value, index, ...other } = props; return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="tab-panel">
          {children}
        </Box>
      )}
    </div>
  );
}

function MyTickets() {
  const [tabValue, setTabValue] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [eventTickets, setEventTickets] = useState([]);
  const [loadingEvent, setLoadingEvent] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const fetchEventDetail = async (eventId) => {
    try {
      setLoadingEvent(true);
      const response = await getListEventById(eventId);
      if (response && response.data) {
        setSelectedEvent(response.data);
        if (response.data.ticket) {
          setEventTickets(JSON.parse(response.data.ticket));
        }
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoadingEvent(false);
    }
  };

  const handleViewEventDetail = (eventId) => {
    if (eventId) {
      fetchEventDetail(eventId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent({});
    setEventTickets([]);
  };

  useEffect(() => {
    fetchMyTickets();
  }, []); const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const response = await getByUserId(user._id);

      if (response && response.data) {
        // Filter only successful payments
        const successfulTickets = response.data.filter(ticket =>
          ticket.status === 'success' || ticket.status === 'completed'
        );
        setTickets(successfulTickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} Tháng ${month}, ${year}`;
  };
  const isEventUpcoming = (eventDate) => {
    return new Date(eventDate) > new Date();
  };
  const upcomingTickets = tickets.filter(ticket =>
    (ticket.status === 'success' || ticket.status === 'completed') &&
    isEventUpcoming(ticket.event?.timeStart)
  );

  const pastTickets = tickets.filter(ticket =>
    (ticket.status === 'success' || ticket.status === 'completed') &&
    !isEventUpcoming(ticket.event?.timeStart)
  );

  const renderTicketTable = (ticketList) => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <Typography>Đang tải...</Typography>
        </Box>
      );
    }

    // Tạo danh sách vé riêng lẻ từ số lượng đã mua
    const expandedTickets = [];
    ticketList.forEach((ticket) => {
      const ticketCount = ticket.number || 1;
      for (let i = 0; i < ticketCount; i++) {
        expandedTickets.push({
          ...ticket,
          ticketIndex: i + 1,
          uniqueId: `${ticket._id}_${i + 1}`
        });
      }
    });

    if (expandedTickets.length === 0) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" className="empty-state">
          <ConfirmationNumberIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            Chưa có vé nào
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={2.5} sx={{ mt: 1.5 }}>
        {expandedTickets.map((ticket) => (
          <Grid item xs={12} sm={12} md={6} lg={4} key={ticket.uniqueId}><Paper
            elevation={2}
            sx={{
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
              },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#ffffff',
              border: '1px solid #e0e0e0'
            }}
          >            <Box
            sx={{
              bgcolor: tabValue === 0 ? '#4caf50' : '#757575',
              color: 'white',
              p: 1.5,
              pl: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight="medium">
                    {ticket.status === 'success' ? 'Thành công' : 'Đã hoàn thành'}
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      borderRadius: '10px',
                      px: 1,
                      py: 0.2,
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Vé #{ticket.ticketIndex}
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mt={0.5}>
                  <Box
                    component="div"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.8)',
                      mr: 1
                    }}
                  />
                  <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.7rem' }}>
                    {ticket.createdAt ? formatDate(ticket.createdAt) : ''}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  fontSize: '0.7rem',
                  fontWeight: 'medium'
                }}
              >
                {isEventUpcoming(ticket.event?.timeStart) ? 'Sắp diễn ra' : 'Đã kết thúc'}
              </Box>
            </Box>

            <Box p={3} display="flex" flexDirection="column" justifyContent="space-between" flexGrow={1}>                <Box>                  <Box sx={{ mb: 2 }}>              <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                mb: 0.5,
                fontSize: '1rem',
                lineHeight: 1.3
              }}
            >
              {ticket.event?.name || 'Không có thông tin'}
            </Typography>
              <Box display="flex" gap={1} alignItems="center">
                <CalendarTodayIcon fontSize="small" sx={{ color: '#757575', fontSize: '1rem' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                  {ticket.event?.timeStart ? formatDisplayDate(ticket.event.timeStart) : 'Không có thông tin'}
                </Typography>
              </Box>
            </Box>              <Box mb={1.2} sx={{ fontSize: '0.85rem' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Mã vé:
                </Typography>
                <Typography
                  variant="body2"
                  fontFamily="monospace"
                  fontWeight="500"
                  sx={{ wordBreak: "break-all" }}
                >
                  {ticket._id}-{String(ticket.ticketIndex).padStart(2, '0')}
                </Typography>
              </Box><Box mb={1.2} sx={{ fontSize: '0.85rem' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Địa điểm:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: '500'
                  }}
                >
                  {ticket.event?.address ? ticket.event.address : 'Không có thông tin'}
                </Typography>
              </Box>              <Box display="flex" justifyContent="space-between" mb={1.2} sx={{ fontSize: '0.85rem' }}>
                <Typography variant="body2" color="text.secondary">
                  Mã đơn hàng:
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="500"
                  fontFamily="monospace"
                  sx={{
                    wordBreak: "break-all",
                    fontSize: '0.75rem'
                  }}
                >
                  {ticket._id}
                </Typography>
              </Box>
            </Box>                <Box
              mt={2.5}
              pt={1.5}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{ borderTop: '1px dashed #eee' }}
            >                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    Giá vé:
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color={tabValue === 0 ? 'primary.main' : 'text.primary'}
                    sx={{ fontSize: '1.1rem', lineHeight: 1.2 }}
                  >
                    {formatCurrency(ticket.amount / (ticket.number || 1))}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    sx={{
                      bgcolor: '#f5f5f5',
                      '&:hover': {
                        bgcolor: '#e0e0e0'
                      },
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      width: 36,
                      height: 36
                    }}
                    onClick={() => handleViewEventDetail(ticket.event?._id)}
                    disabled={!ticket.event?._id}
                    title="Xem chi tiết sự kiện"
                    size="small"
                  >
                    <VisibilityIcon sx={{ fontSize: '1rem' }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }; return (
    <Box display="flex" minHeight="100vh" className="my-tickets-container">
      <SideBarAdmin />
      <Box flex={1} p={3} sx={{ bgcolor: '#f5f8fa' }}>
        <Container maxWidth="xl">
          <Card elevation={3} className="tickets-card">
            <CardContent>              <Box display="flex" alignItems="center" gap={2} className="page-header" sx={{ mb: 2 }}>
              <ConfirmationNumberIcon color="primary" sx={{ fontSize: 28 }} />                <Box>
                <Typography variant="h5" fontWeight="bold" color="primary" sx={{ lineHeight: 1.3 }}>
                  Vé đã mua
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quản lý các vé đã mua của bạn
                </Typography>
              </Box>
            </Box><Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTab-root': {
                      fontSize: '0.9rem',
                      fontWeight: 'medium'
                    },
                    '& .Mui-selected': {
                      fontWeight: 'bold'
                    }
                  }}
                >                  <Tab
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <EventIcon />
                        Sắp diễn ra
                      </Box>
                    }
                  />
                  <Tab
                    label={
                      <Box display="flex" alignItems="center" gap={1}>
                        <EventIcon />
                        Đã kết thúc
                      </Box>
                    }
                  />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                {renderTicketTable(upcomingTickets)}
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                {renderTicketTable(pastTickets)}
              </TabPanel>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Event Detail Modal */}
      <ModalUpdate
        open={isModalOpen}
        showCancel={false}
        title={"Chi tiết sự kiện"}
        titleOk={"Đóng"}
        handleClose={handleCloseModal}
        handleOk={handleCloseModal}
        maxWidth={"md"}
      >
        {loadingEvent ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography>Đang tải thông tin sự kiện...</Typography>
          </Box>
        ) : (
          <>
            <Stack alignItems={"center"}>
              <Box
                src={selectedEvent?.image}
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
                    Tên sự kiện: {selectedEvent?.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    Địa điểm tổ chức: {selectedEvent?.address}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    Ngày bắt đầu: {selectedEvent?.timeStart ? formatDate(selectedEvent.timeStart) : ''}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    Ngày kết thúc: {selectedEvent?.timeEnd ? formatDate(selectedEvent.timeEnd) : ''}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    Email: {selectedEvent?.email}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    Số điện thoại: {selectedEvent?.phone}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    Loại sự kiện: {listTypeEvent[selectedEvent?.typeEvent - 1]?.label}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    Trạng thái phê duyệt:{" "}
                    {selectedEvent?.isApprove === 0
                      ? "Chưa được phê duyệt"
                      : "Đã được phê duyệt"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">
                    Quyền riêng tư:{" "}
                    {selectedEvent?.permission === 0 ? "Riêng tư" : "Công khai"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">
                    Thông tin sự kiện: {selectedEvent?.infoEvent}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">
                    Thông tin nhà tổ chức: {selectedEvent?.infoOrganize}
                  </Typography>
                </Grid>
                {selectedEvent?.seatingChart && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" mb={2}>
                      Sơ đồ chỗ ngồi:
                    </Typography>
                    <Box display="flex" justifyContent="center">
                      <Box
                        component="img"
                        src={selectedEvent.seatingChart}
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
                  {eventTickets?.length > 0 && (
                    <Grid container spacing={4}>
                      {eventTickets?.map((ticket, index) => (
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
                                Mô tả vé: {ticket?.descriptionTicket}
                              </Typography>
                              <Typography variant="subtitle2" mt={1}>
                                Giá vé: {formatCurrency(ticket?.priceTicket)}
                              </Typography>
                              <Typography variant="subtitle2" mt={1}>
                                Tổng số vé phát hành: {ticket?.totalTicket}
                              </Typography>
                              <Typography variant="subtitle2" mt={1}>
                                Số lượt mua tối đa trong 1 lần: {ticket?.maxTicket}
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
          </>
        )}
      </ModalUpdate>
    </Box>
  );
}

export default MyTickets;
