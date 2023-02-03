import { createTheme } from "@mui/material/styles";
import { BC_COLOURS } from "./bcGovStyles";

export const bcGovTheme = createTheme({
  palette: {
    primary: {
      main: BC_COLOURS.bc_primary_blue,
    },
    secondary: {
      main: BC_COLOURS.bc_background_light_grey,
    },
    tertiary: {
      main: BC_COLOURS.white,
    },
    error: {
      main: BC_COLOURS.bc_red,
    },
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
      color: BC_COLOURS.bc_black,
    },
    h2: {
      color: BC_COLOURS.bc_black,
      fontWeight: "bold",
      fontSize: "24px",
      paddingTop: "60px",
      paddingBottom: "24px",
      borderBottom: `1px solid ${BC_COLOURS.bc_text_box_border_grey}`,
      display: "inline-block",
      letterSpacing: "-0.48px",
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 14,
          //backgroundColor: BC_COLOURS.bc_black,
          //color: BC_COLOURS.white,
          boxShadow: `0px 4px 8px ${BC_COLOURS.shadow_colour}`,
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        // The props to apply
        disableRipple: true, // No more ripple, on the whole application
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          disableRipple: true,
          minHeight: "48px",
          padding: "0px 32px",
          borderRadius: 4,
          "&:hover": {
            backgroundColor: BC_COLOURS.button_hover,
          },
          "&:focus": {
            outline: "2px solid",
            outlineColor: BC_COLOURS.focus_blue,
          },
          //transition: "0.5s all",
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: "0px",
          fontSize: "16px",
          color: BC_COLOURS.bc_red,
        },
      },
    },
    // Also see CustomFormComponents.tsx for border colour
    // override based on error/invalid input
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: "48px",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "2px solid",
            boxShadow: `0px 4px 8px ${BC_COLOURS.shadow_colour}`,
          },
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: BC_COLOURS.bc_text_box_border_grey,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          paddingLeft: "0px",
          paddingRight: "0px",
          marginRight: "40px",
          fontWeight: 700,
          "&.Mui-focusVisible": {
            border: "2px solid",
            borderColor: BC_COLOURS.focus_blue,
          },
        },
      },
    },
  },
});

/**
 * https://stackoverflow.com/questions/50069724/how-to-add-custom-mui-palette-colors
 *
 * Used for onRouteBC tertirary button style
 *
 * Update the TypeScript definition, so it can recognize custom properties
 * when referencing the Palette and PaletteOption objects
 */
declare module "@mui/material/styles" {
  interface Palette {
    tertiary: {
      main: string;
    };
  }
  interface PaletteOptions {
    tertiary: {
      main: string;
    };
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}
