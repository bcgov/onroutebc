import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import lottie from "lottie-web";
import loading_6 from "../../../public/loading_grey.json";

export const Loading = () => {
  let count = 0;
  useEffect(() => {
    const exsitingSvg = document.getElementsByTagName("svg");
    if (exsitingSvg.length !== 0) {
      const container = document.getElementById("lottie-container");

      if (container && count === 0) {
        lottie.loadAnimation({
          container: container,
          renderer: "svg", // or 'canvas', 'html'
          loop: true,
          autoplay: true,
          animationData: loading_6,
        });
        count++;
      }
    }
  }, []);

  return (
    <div style={{ paddingTop: "24px" }}>
      <Box className="success feature-container">
        <div
          id="lottie-container"
          style={{ width: "188px", height: "188px" }}
        ></div>
        <Typography variant="h4" sx={{ color: "#313132" }}>
          Processing, please wait...
        </Typography>
      </Box>
    </div>
  );
};
