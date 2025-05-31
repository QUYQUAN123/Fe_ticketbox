import { Button } from "@mui/material";
import React from "react";

function ButtonCustom({ sx, text, ...props }) {
  return (
    <Button
      sx={{
        bgcolor: "rgb(45, 194, 117)",
        "&:hover": {
          bgcolor: "rgb(45, 194, 117)",
        },
        ...sx,
      }}
      {...props}
    >
      {text}
    </Button>
  );
}

export default ButtonCustom;
