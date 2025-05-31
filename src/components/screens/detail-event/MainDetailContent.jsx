import { Box, Container, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import About from "./About";
import TicketInfomation from "./TicketInfomation";
import EventRating from "./EventRating";

function MainDetailContent({ event, recommend }) {
  const [ticket, setTicket] = useState({});

  const handleClick = (targetId) => {
    const targetElement = document.getElementById(targetId);
    targetElement.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    event?.ticket && setTicket(JSON?.parse(event?.ticket));
  }, [event]);

  return (
    <Box>
      <Divider />
      <Container>
        <Box display={"flex"} gap={4} py={2} sx={{ cursor: "pointer" }}>
          <Typography variant="subtitle1" onClick={() => handleClick("about")}>
            Thông tin sự kiện
          </Typography>
          <Typography
            variant="subtitle1"
            onClick={() => handleClick("ticket-information")}
          >
            Thông tin vé
          </Typography>          <Typography
            variant="subtitle1"
            onClick={() => handleClick("ratings")}
          >
            Đánh giá
          </Typography>
        </Box>
      </Container>
      <Divider />

      <Box bgcolor={"#f1f1f1"} paddingY={"30px"}>
        <Container>          <About event={event} />
          {ticket && <TicketInfomation ticket={ticket} eventId={event?._id} />}
          <EventRating event={event} />
        </Container>
      </Box>
    </Box>
  );
}

export default MainDetailContent;
