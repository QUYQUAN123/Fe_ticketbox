import React from "react";
import { Button, Box, TextField, Grid } from "@mui/material";

function SearchTopic() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={4.5}>
        <TextField fullWidth size="small" placeholder="Nhập mã đề tài" />
      </Grid>
      <Grid item xs={4.5}>
        <TextField fullWidth size="small" placeholder="Nhập tên đề tài" />
      </Grid>
      <Grid item xs={3}>
        <Box display={"flex"} gap={1} justifyContent={"center"}>
          <Button variant="outlined" color="error" fullWidth>
            Clear
          </Button>
          <Button variant="contained" fullWidth>
            Tìm kiếm
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default SearchTopic;
