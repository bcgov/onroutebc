import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Box } from "@mui/material";

import { ErrorFallback } from "../../common/pages/ErrorFallback";
import { ShoppingCartPage } from "./pages/ShoppingCart/ShoppingCartPage";
import { Banner } from "../../common/components/dashboard/components/banner/Banner";

export const ShoppingCartDashboard = React.memo(() => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Box
        className="layout-box"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Banner bannerText="Pay for Permit" />
      </Box>

      <ShoppingCartPage />
    </ErrorBoundary>
  );
});

ShoppingCartDashboard.displayName = "ShoppingCartDashboard";
