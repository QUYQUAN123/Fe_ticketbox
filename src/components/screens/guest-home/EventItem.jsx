import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { listTypeEvent } from "../../../contstant/event";

function EventItem({ event }) {
  return (
    <Box
      sx={{
        cursor: "pointer",
        "&:hover": {
          color: "rgb(42, 45, 52)",
          opacity: 0.5,
        },
      }}
    >
      <Box
        component={"img"}
        src={event?.image}
        width={"100%"}
        height={140}
        sx={{ objectFit: "cover", borderRadius: "8px" }}
      />
      <Stack>
        <Typography fontSize={18} lineHeight={"24px"} fontWeight={"bold"}>
          {event.name}
        </Typography>
        <Typography
          mt={"8px"}
          fontSize={14}
          lineHeight={"20px"}
          color="rgb(42, 45, 52)"
        >
          {event.timeStart} - {event.timeEnd}
        </Typography>
        <Typography
          mt={"8px"}
          fontSize={14}
          lineHeight={"20px"}
          color="rgb(130, 139, 160)"
        >
          {listTypeEvent[event?.typeEvent - 1]?.label}
        </Typography>
      </Stack>
    </Box>
  );
}

export default EventItem;
