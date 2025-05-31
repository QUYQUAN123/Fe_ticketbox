import React from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { Box } from "@mui/material";

function PaypalButtonCustom({ amount, sx, handleOk }) {
  return (
    <Box width={"100%"} height={60} overflow={"hidden"} sx={sx}>
      <PayPalButton
        amount={amount}
        onSuccess={(details, data) => {
          handleOk(details);
        }}
      />
    </Box>
  );
}

export default PaypalButtonCustom;
