import React from "react";
import { Grid, Box } from "@mui/material";
import Header from "./header";
import Sidebar from "./sidebar/SideBar";

function MainLayout({ children }) {
  return (
    <>
      <Header />
      <Box py={2} bgcolor={"#F5F7FC"} mt={"76px"}>
        <Grid container spacing={4}>
          <Grid item xs={2}>
            <Sidebar />
          </Grid>
          <Grid item xs={10}>
            <Box
              bgcolor={"#fff"}
              borderRadius={"4px"}
              padding={"64px"}
              maxHeight={"calc(100vh - 120px)"}
              sx={{ overflowY: "scroll" }}
            >
              {children}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default MainLayout;
