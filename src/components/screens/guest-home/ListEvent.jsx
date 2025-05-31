import { Box, Grid, Typography, Chip } from "@mui/material";
import React from "react";
import EventItem from "./EventItem";
import { useNavigate } from "react-router-dom";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

function ListEvent({ data = [], isHotEvents = false }) {
  const navigate = useNavigate();

  const renderHotEventBadge = (index) => {
    if (!isHotEvents) return null;

    let color;
    switch (index) {
      case 0:
        color = "#f5222d";
        break; 
      case 1:
        color = "#fa8c16";
        break; 
      case 2:
        color = "#faad14";
        break;
      default:
        color = "#8c8c8c"; 
    }

    return (
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          backgroundColor: color,
          color: "white",
          borderRadius: "20px",
          px: 1.5,
          py: 0.5,
          fontWeight: "bold",
          fontSize: "14px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <LocalFireDepartmentIcon sx={{ fontSize: 16, mr: 0.5 }} />
        TOP {index + 1}
      </Box>
    );
  };

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          padding: "40px 0",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          marginTop: "20px",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Không tìm thấy sự kiện nào
        </Typography>
        <Typography color="text.secondary">
          Hãy thử tìm kiếm với tiêu chí khác
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={4}>
        {data.map((event, index) => {
          const normalizedEvent = {
            ...event,

            name: event.eventName || event.name,
            image: event.eventImage || event.image,
            typeEvent: event.typeEvent || 1,
          };

          return (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={event._id}
              sx={{ position: "relative" }}
              onClick={() => {
                navigate(`/event/${event._id}-${normalizedEvent.typeEvent}`);
              }}
            >
              {renderHotEventBadge(index)}
              <Box sx={{ position: "relative" }}>
                <EventItem event={normalizedEvent} />
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default ListEvent;
