import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import CardEvent from "./CardEvent";
import { useNavigate } from "react-router-dom";

function Recommended({ recommend }) {
  const navigate = useNavigate();
  return (
    <Box id="recommended" mt={8}>
      <Box
        sx={{ cursor: "pointer" }}
        display={"flex"}
        alignItems={"center"}
        gap={1}
      >
        <DateRangeOutlinedIcon sx={{ color: "rgb(45, 194, 117)" }} />
        <Typography variant="h6">Đề xuất sự kiện cho bạn</Typography>
      </Box>
      <Box mt={2}>
        <Grid container spacing={2}>
          {recommend?.map((event) => (
            <Grid
              item
              xs={4}
              key={event?._id}
              onClick={() => navigate(`/event/${event._id}-${event.typeEvent}`)}
            >
              <CardEvent event={event} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default Recommended;
