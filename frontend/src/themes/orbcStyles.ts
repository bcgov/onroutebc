import { BC_COLOURS } from "./bcGovStyles";

// Styles currently being used in Company Info Forms
export const DEFAULT_WIDTH = "528px";
export const CITY_WIDTH = "304px";
export const POSTAL_WIDTH = "184px";
export const PHONE_WIDTH = "344px";
export const EXT_WIDTH = "144px";

// Styles currently being used in Permit Forms
export const PERMIT_LEFT_COLUMN_WIDTH = "400px";
export const PERMIT_MAIN_BOX_STYLE = {
  display: "flex",
  flexWrap: "wrap",
  backgroundColor: BC_COLOURS.white,
  borderBottom: `1px solid ${BC_COLOURS.bc_text_box_border_grey}`,
  paddingBottom: "24px",
};
export const PERMIT_LEFT_HEADER_STYLE = {
  //marginTop: "0px",
  //paddingTop: "0px",
};
export const PERMIT_LEFT_BOX_STYLE = {
  paddingTop: "24px",
  minWidth: "400px",
  maxWidth: PERMIT_LEFT_COLUMN_WIDTH,
};
export const PERMIT_RIGHT_BOX_STYLE = {
  paddingTop: "24px",
  maxWidth: `calc(100% - ${PERMIT_LEFT_COLUMN_WIDTH})`,
  minWidth: "600px",
};
