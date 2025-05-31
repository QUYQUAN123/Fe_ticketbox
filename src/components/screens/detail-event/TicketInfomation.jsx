import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ModalUpdate from "../../common/ModalUpdate";
import PaypalButtonCustom from "../../common/PaypalButtonCustom";
import VNPayButtonCustom from "../../common/VNPayButtonCustom";
import { notify } from "../../../utils/helpers/notify";
import { formatCurrency, formatUSD } from "../../../utils/helpers/formatCurrency";
import { create, numberTicketSell } from "../../../utils/api/payment";
import moment from "moment";

function TicketInfomation({ ticket, eventId }) {
  const [currentTicket, setCurrentTicket] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [number, setNumber] = useState(0);
  const [user, setUser] = useState({});
  const [ticketData, setTicketData] = useState([]);
  const [remain, setRemain] = useState(0);
  const handleChooseTicket = (t, i) => {
    if (user) {
      setCurrentTicket(t);
      setIsOpen(true);
      setNumber(0);
      setRemain(i);
    } else {
      notify("warn", "Bạn cần đăng nhập để book vé");
    }
  };

  // Function to refresh ticket data
  const refreshTicketData = async () => {
    if (Array.isArray(ticket)) {
      const updatedTicketData = await Promise.all(
        ticket.map(async (t) => {
          const res = await numberTicketSell({ name: t.nameTicket, eventId });
          const soldTickets = Number(res.data?.totalNumber);
          const remainingTickets = t.totalTicket - soldTickets;
          return {
            ...t,
            soldTickets,
            remainingTickets,
          };
        })
      );

      setTicketData(updatedTicketData);
    }
  };
  const handleChange = (e) => {
    console.log(e.target.value);
    if (Number(e.target.value) > Number(currentTicket.maxTicket)) {
      notify("warn", "Bạn đã mua quá số lượt trong 1 lần mua");
    } else if (Number(e.target.value) > remain) {
      notify("warn", "Bạn đã mua quá số vé còn lại");
    } else {
      setNumber(parseInt(e.target.value));
      setAmount(Number(currentTicket?.priceTicket) * Number(e.target.value));
    }
  };

  const handlePayment = async (data) => {
    setIsOpen(false);
    try {
      await create({
        number,
        name: currentTicket?.nameTicket,
        price: currentTicket?.priceTicket,
        amount,
        event: eventId,
        user: user?._id,
      });
      console.log("hello");
      notify(
        "success",
        "Đặt vé thành công. Nếu bạn đã cài đặt mail vui lòng check email"
      );
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (Array.isArray(ticket)) {
        const updatedTicketData = await Promise.all(
          ticket.map(async (t) => {
            const res = await numberTicketSell({ name: t.nameTicket, eventId });
            const soldTickets = Number(res.data?.totalNumber);
            const remainingTickets = t.totalTicket - soldTickets;
            return {
              ...t,
              soldTickets,
              remainingTickets,
            };
          })
        );

        setTicketData(updatedTicketData);
      }
    };

    fetchData();
  }, [ticket, eventId]);

  useEffect(() => {
    const getData = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
    };
    getData();
  }, []);

  return (
    <Box mt={8} id="ticket-information">
      <Paper>
        <Box p={2}>
          <Typography variant="h6">THÔNG TIN VÉ</Typography>
        </Box>
        <Divider />
        {ticketData?.length > 0 &&
          ticketData?.map((t, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{t?.nameTicket}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid xs={6} item>
                    <Typography variant="subtitle2">
                      Ngày mở bán: {t?.timeTicketStart}
                    </Typography>
                  </Grid>
                  <Grid xs={6} item>
                    <Typography variant="subtitle2">
                      Ngày ngừng bán: {t?.timeTicketEnd}
                    </Typography>
                  </Grid>                  <Grid xs={6} item>
                    <Typography variant="subtitle2">
                      Giá vé: {formatCurrency(t?.priceTicket)}
                    </Typography>
                  </Grid>
                  <Grid xs={6} item>
                    <Typography variant="subtitle2">
                      Tổng số vé phát hành: {t?.totalTicket}
                    </Typography>
                  </Grid>
                  <Grid xs={6} item>
                    <Typography variant="subtitle2">
                      Tổng số vé còn lại: {t.remainingTickets}
                    </Typography>
                  </Grid>
                  <Grid xs={6} item>
                    <Typography variant="subtitle2">
                      Tổng số vé bán ra: {t.soldTickets}
                    </Typography>
                  </Grid>
                  <Grid xs={6} item>
                    <Typography variant="subtitle2">
                      Số lượt mua tối đa / lần: {t?.maxTicket}
                    </Typography>
                  </Grid>
                  <Grid xs={12} item>
                    <Typography variant="subtitle2">
                      Mô tả vé: {t?.descriptionTicket}
                    </Typography>
                  </Grid>

                  {Number(t.remainingTickets) > 0 ? (
                    <Grid xs={12} item textAlign={"center"}>
                      {moment(moment().format("YYYY-MM-DD")).isBefore(
                        t?.timeTicketStart
                      ) ? (
                        <Button variant="contained">
                          Chưa đến thời gian bán vé
                        </Button>
                      ) : moment(moment().format("YYYY-MM-DD")).isAfter(
                        t?.timeTicketEnd
                      ) ? (
                        <Button variant="contained">
                          Đã hết thời gian ngày bán vé
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={() =>
                            handleChooseTicket(t, Number(t.remainingTickets))
                          }
                        >
                          Đặt vé ngay
                        </Button>
                      )}
                    </Grid>
                  ) : (
                    <Grid xs={12} item textAlign={"center"}>
                      <Button color="error" variant="contained">
                        Hết vé
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
      </Paper>      <ModalUpdate
        open={isOpen}
        showCancel={false}
        showOk={false}
        title={currentTicket?.nameTicket}
        handleClose={() => {
          setIsOpen(false);
          // Refresh ticket data when modal is closed
          const fetchData = async () => {
            if (Array.isArray(ticket)) {
              const updatedTicketData = await Promise.all(
                ticket.map(async (t) => {
                  const res = await numberTicketSell({ name: t.nameTicket, eventId });
                  const soldTickets = Number(res.data?.totalNumber);
                  const remainingTickets = t.totalTicket - soldTickets;
                  return {
                    ...t,
                    soldTickets,
                    remainingTickets,
                  };
                })
              );
              setTicketData(updatedTicketData);
            }
          };
          fetchData();
        }}
      >        <Typography variant="subtitle2">
          Giá vé/lượt: {formatCurrency(currentTicket?.priceTicket)}
        </Typography>
        <Typography mt={2} variant="subtitle2">
          Nhập số lượng vé mua:
        </Typography>
        <TextField
          size="small"
          fullWidth
          mt={1}
          value={number}
          onChange={handleChange}
          type="number"
        />        <Typography mt={2} variant="subtitle2">
          Số tiền cần thanh toán: {formatCurrency(amount)}
        </Typography>
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} mt={4} gap={2}>
          {amount > 0 && (
            <>
              <Typography variant="subtitle1" fontWeight="bold">
                Chọn phương thức thanh toán:
              </Typography>
              <Box width="100%" maxWidth={300}>
                <VNPayButtonCustom
                  paymentData={{
                    number,
                    name: currentTicket?.nameTicket,
                    price: currentTicket?.priceTicket,
                    amount,
                    event: eventId,
                    user: user?._id,
                  }}
                />

              </Box>
            </>
          )}
        </Box>
      </ModalUpdate>
    </Box>
  );
}

export default TicketInfomation;
