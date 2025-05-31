import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, Chip } from "@mui/material";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { listTypeEvent } from "../../../contstant/event";
import moment from "moment";

export default function CardEvent({ event }) {
  return (
    <Card sx={{ width: "100%" }}>
      <CardMedia sx={{ height: 140 }} image={event?.image} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {event?.name}
        </Typography>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box display={"flex"} gap={"2px"} alignItems={"center"}>
            <LocalPhoneOutlinedIcon fontSize="20px" />
            <Typography variant="subtitle2">{event?.phone}</Typography>
          </Box>
          <Box display={"flex"} gap={"2px"} alignItems={"center"}>
            <DateRangeOutlinedIcon fontSize="20px" />
            <Typography variant="subtitle2">
              {moment(event?.timeStart).format("DD.MM.YYYY")}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Chip label={listTypeEvent[event?.typeEvent - 1].label} color="error" />
        <Chip label={event?.address} color="success" />
      </CardActions>
    </Card>
  );
}
