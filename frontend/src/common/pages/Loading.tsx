import { Box, Typography, CircularProgress } from "@mui/material";

export const Loading = () => {
  return (
    <div style={{ paddingTop: "24px" }}>
      <Box
        className="success feature-container"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={120} thickness={4} sx={{ color: "#606060" }} />

        <Typography variant="h4" sx={{ color: "#313132" }}>
          Processing, please wait...
        </Typography>
      </Box>
    </div>
  );
};
