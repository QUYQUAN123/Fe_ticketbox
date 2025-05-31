import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";

function About({ event }) {
  return (
    <Box mt={8} id="about">
      <Paper>
        <Box p={2}>
          <Typography variant="h6">Thông tin sự kiện</Typography>
        </Box>
        <Divider />
        <Box p={2}>
          <Typography variant="body1" fontWeight={600}>
            Thông tin sự kiện:
          </Typography>
          {event?.infoEvent?.split(".")?.map((e, index) => (
            <Typography mt={2} key={index}>
              🌹 {e}
            </Typography>
          ))}
          <Typography variant="body1" fontWeight={600} mt={2}>
            Thông tin nhà tổ chức:
          </Typography>          {event?.infoOrganize?.split(".")?.map((e, index) => (
            <Typography mt={2} key={index}>
              🌹 {e}
            </Typography>
          ))}
          {event?.seatingChart && (
            <>
              <Typography variant="body1" fontWeight={600} mt={3}>
                Sơ đồ chỗ ngồi:
              </Typography>
              <Box mt={2} display="flex" justifyContent="center">
                <Box
                  component="img"
                  src={event.seatingChart}
                  alt="Sơ đồ chỗ ngồi"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "500px",
                    objectFit: "contain",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0"
                  }}
                />
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default About;
