import { useForm, FormProvider, FieldValues } from "react-hook-form";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TermOversizeApplication } from "../../../types/application";
import { useSubmitTermOversizeMutation } from "../../../apiManager/hooks";
import { ContactDetails } from "../ContactDetails";
import { ApplicationDetails } from "../ApplicationDetails";
import { PermitDetails } from "./PermitDetails";
import { VehicleDetails } from "../VehicleDetails";
import dayjs from "dayjs";
import { useCompanyInfoQuery } from "../../../../manageProfile/apiManager/hooks";
import { formatPhoneNumber } from "../../../../../common/components/form/subFormComponents/PhoneNumberInput";
import { useContext, useEffect, useState } from "react";
import { BC_COLOURS } from "../../../../../themes/bcGovStyles";
import { PERMIT_LEFT_COLUMN_WIDTH } from "../../../../../themes/orbcStyles";
import { ApplicationContext } from "../../../context/ApplicationContext";

export const TermOversizeReview = () => {
  const applicationContext = useContext(ApplicationContext);

  return (
    <>
      <Box
        className="layout-box"
        sx={{
          display: "flex",
          height: "60px",
          alignItems: "center",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <Typography
          sx={{
            color: BC_COLOURS.bc_text_links_blue,
            cursor: "pointer",
            marginRight: "8px",
            textDecoration: "underline",
          }}
        >
          Permits
        </Typography>
        <i
          className="fa fa-chevron-right"
          style={{ marginLeft: "8px", marginRight: "8px" }}
        ></i>
        <Typography>Permit Application</Typography>
      </Box>
      <Box
        className="layout-box"
        sx={{
          paddingTop: "24px",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <Box sx={{ paddingBottom: "80px" }}>
          <Typography
            variant={"h1"}
            sx={{
              marginRight: "200px",
              marginTop: "0px",
              paddingTop: "0px",
              borderBottom: "none",
            }}
          >
            Oversize: Term
          </Typography>

          <Typography>
            vehicleSubType:{" "}
            {
              applicationContext?.applicationData?.application.vehicleDetails
                ?.vehicleSubType
            }
          </Typography>
          <Button
            variant="contained"
            onClick={() => applicationContext?.back()}
          >
            Back
          </Button>
        </Box>
      </Box>
    </>
  );
};
