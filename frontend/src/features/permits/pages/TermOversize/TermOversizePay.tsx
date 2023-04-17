import { Box, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { ApplicationContext } from "../../context/ApplicationContext";
import { ProgressBar } from "../../components/progressBar/ProgressBar";

export const TermOversizePay = () => {
  const { applicationData } = useContext(ApplicationContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ProgressBar />
      <Box
        className="layout-box"
        sx={{
          paddingTop: "24px",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <Typography>TODO</Typography>
        <Typography>Application Data:</Typography>
        <pre>{JSON.stringify(applicationData, null, 2)}</pre>
      </Box>
    </>
  );
};
