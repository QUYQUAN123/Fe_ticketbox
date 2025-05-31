import React from "react";
import { Grid, Box } from "@mui/material";
import Header from "./header";
import SidebarEvent from "./sidebar/SideBarEvent";
import Footer from "./footer";

function EventLayout({ children }) {
  return (
    <>
      <Header />
      <Box py={2} bgcolor={"#F5F7FC"} mt={"76px"}>
        <Grid container spacing={4}>
          <Grid item xs={2}>
            <SidebarEvent />
          </Grid>
          <Grid item xs={10}>
            <Box bgcolor={"#fff"} borderRadius={"4px"}>
              {children}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

export default EventLayout;
