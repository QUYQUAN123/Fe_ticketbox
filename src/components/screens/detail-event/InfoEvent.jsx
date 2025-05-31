import React from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import ButtonCustom from "../../common/ButtonCustom";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import moment from "moment";
import { listTypeEvent } from "../../../contstant/event";

function InfoEvent({ event }) {
  return (
    <Box>
      <Box
        component={"img"}
        src={event?.image}
        width={"100%"}
        height={"50vh"}
        sx={{ objectFit: "cover" }}
      />
      <Container>
        <Box py={"30px"}>
          <Grid container>
            <Grid xs={6} item>
              <Typography fontSize={24} fontWeight={700}>
                {event?.name}
              </Typography>
              <Box mt={1} display={"flex"} alignItems={"center"} gap={2}>
                <AccessTimeOutlinedIcon />
                <Typography variant="subtitle2">
                  {moment(event?.timeStart).format("DD/MM/YYYY")} -{" "}
                  {moment(event?.timeEnd).format("DD/MM/YYYY")}
                </Typography>
              </Box>
              <Box mt={1} display={"flex"} alignItems={"center"} gap={2}>
                <LocationOnOutlinedIcon />
                <Typography variant="subtitle2">{event?.address}</Typography>
              </Box>
              <Box mt={1} display={"flex"} alignItems={"center"} gap={2}>
                <EmailOutlinedIcon />
                <Typography variant="subtitle2">{event?.email}</Typography>
              </Box>
              <Box mt={1} display={"flex"} alignItems={"center"} gap={2}>
                <PhoneAndroidOutlinedIcon />
                <Typography variant="subtitle2">{event?.phone}</Typography>
              </Box>
            </Grid>
            <Grid xs={2}></Grid>
            <Grid xs={4} item>
              <ButtonCustom
                fullWidth
                variant="contained"
                size={"large"}
                text={listTypeEvent[event?.typeEvent - 1]?.label}
              />
              <Box mt={2} display={"flex"} justifyContent={"space-between"}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<FacebookOutlinedIcon />}
                >
                  Share to Facebook
                </Button>
                <Button
                  component="label"
                  variant="outlined"
                  color="success"
                  startIcon={<FavoriteBorderOutlinedIcon />}
                >
                  Follow
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default InfoEvent;
