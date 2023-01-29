import { createTheme } from "@mui/material/styles";
import { BC_PRIMARY_BLUE, BC_BACKGROUND_LIGHT, BC_TEXT } from "./bcGovStyles";

/*
 *
 * Code based on WPS repo
 * https://github.com/bcgov/wps/blob/main/web/src/app/theme.ts
 * https://mui.com/material-ui/customization/theming/
 *
 */
export const bcGovTheme = createTheme({
  palette: {
    primary: {
      light: "#3E5C93",
      main: BC_PRIMARY_BLUE,
      dark: "#000C3A",
    },
    secondary: {
      light: BC_BACKGROUND_LIGHT,
      main: "#ffffff",
      dark: "#F2F2F2",
    },
    success: { main: "#2E8540" },
    error: { main: "#FF3E34" },
    warning: { main: "#FE7921" },
    contrastThreshold: 3,
    tonalOffset: 0.1,
  },
  typography: {
    button: {
      textTransform: "none",
    },
    fontFamily: ["BCSans", "Noto Sans", "Verdana", "Arial", "sans-serif"].join(
      ","
    ),
    fontSize: 16,
    // From https://developer.gov.bc.ca/Design-System/Typography#paragraphs
    body1: {
      fontSize: 16,
      lineHeight: 1.6,
      marginBottom: 2,
      color: BC_TEXT,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 1080, // Default: 960
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 14,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          //height: "48px",
        },
      },
    },
  },
});
