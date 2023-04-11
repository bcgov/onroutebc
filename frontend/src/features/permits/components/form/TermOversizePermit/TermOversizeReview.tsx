import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Commodities,
  TermOversizeApplication,
} from "../../../types/application";
import { ApplicationDetails } from "../ApplicationDetails";
import { useContext, useEffect, useState } from "react";
import { BC_COLOURS } from "../../../../../themes/bcGovStyles";
import { ApplicationContext } from "../../../context/ApplicationContext";
import { WarningBcGovBanner } from "../../../../../common/components/banners/AlertBanners";
import { PermitExpiryDateBanner } from "../../../../../common/components/banners/PermitExpiryDateBanner";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../../themes/orbcStyles";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

export const TermOversizeReview = () => {
  const { applicationData, back, next } = useContext(ApplicationContext);
  const methods = useForm();
  const onSubmit = (data: any) => next();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <Typography
          sx={{
            color: BC_COLOURS.bc_text_links_blue,
            cursor: "pointer",
            marginRight: "8px",
            textDecoration: "underline",
          }}
          onClick={() => back()}
        >
          Permit Application
        </Typography>
        <i
          className="fa fa-chevron-right"
          style={{ marginLeft: "8px", marginRight: "8px" }}
        ></i>
        <Typography>Review and Confirm Details</Typography>
      </Box>
      <Box
        className="layout-box"
        sx={{
          paddingTop: "24px",
          backgroundColor: BC_COLOURS.white,
        }}
      >
        <Box sx={{ paddingBottom: "80px", marginTop: "-40px" }}>
          <WarningBcGovBanner
            description="Please review and confirm that the information below is correct."
            width="668px"
          />
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

          <ApplicationDetails values={applicationData} />
          <ReviewContactDetails values={applicationData} />
          <ReviewPermitDetails values={applicationData} />
          <ReviewVehicleInfo values={applicationData} />
          <FormProvider {...methods}>
            <FeeSummary />
            <Box
              sx={{
                backgroundColor: BC_COLOURS.white,
                paddingTop: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button
                key="save-TROS-button"
                aria-label="save"
                variant="contained"
                color="secondary"
                onClick={() => back()}
                sx={{ marginRight: "24px" }}
              >
                Edit Application
              </Button>
              <Button
                key="submit-TROS-button"
                aria-label="Submit"
                variant="contained"
                color="primary"
                onClick={methods.handleSubmit(onSubmit)}
              >
                Proceed to Pay
              </Button>
            </Box>
          </FormProvider>
        </Box>
      </Box>
    </>
  );
};

const ReviewContactDetails = ({
  values,
}: {
  values: TermOversizeApplication | undefined;
}) => {
  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography variant={"h3"} sx={PERMIT_LEFT_HEADER_STYLE}>
          Contact Information
        </Typography>
      </Box>
      <Box sx={PERMIT_RIGHT_BOX_STYLE}>
        <Box sx={{ gap: "40px", paddingTop: "24px" }}>
          <Typography>
            {values?.application.contactDetails?.firstName}{" "}
            {values?.application.contactDetails?.lastName}
          </Typography>
          <Typography>
            Primary Phone: {values?.application.contactDetails?.phone1} Ext:{" "}
            {values?.application.contactDetails?.phone1Extension}
          </Typography>
          <Typography>
            Email: {values?.application.contactDetails?.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const ReviewPermitDetails = ({
  values,
}: {
  values: TermOversizeApplication | undefined;
}) => {
  console.log("values", values);
  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography variant={"h3"} sx={PERMIT_LEFT_HEADER_STYLE}>
          Permit Details
        </Typography>
      </Box>
      <Box sx={PERMIT_RIGHT_BOX_STYLE}>
        <Box sx={{ gap: "40px", paddingTop: "24px" }}>
          <Typography sx={{ fontWeight: "bold" }}>Start Date:</Typography>
          <Typography>{values?.application.startDate.format("LL")}</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Permit Duration:</Typography>
          <Typography>{values?.application.permitDuration} Days</Typography>
        </Box>
        <PermitExpiryDateBanner
          expiryDate={values?.application.expiryDate.format("LL") || ""}
        />
        <Box>
          <Typography variant="h3">
            Selected commodities and their respective CVSE forms.
          </Typography>
          <ReviewTable values={values} />
        </Box>
      </Box>
    </Box>
  );
};
const ReviewTable = ({
  values,
}: {
  values: TermOversizeApplication | undefined;
}) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Conditions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {values?.application.commodities.map((row: Commodities) => {
            return (
              <TableRow
                key={row.condition}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
              >
                <TableCell component="th" scope="row">
                  <Checkbox
                    key={row.condition}
                    checked={true}
                    disabled={true}
                  />
                  {row.description}
                </TableCell>

                <TableCell component="th" scope="row">
                  <a href={row.conditionLink}>{row.condition}</a>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ReviewVehicleInfo = ({
  values,
}: {
  values: TermOversizeApplication | undefined;
}) => {
  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography variant={"h3"} sx={PERMIT_LEFT_HEADER_STYLE}>
          Vehicle Information
        </Typography>
      </Box>
      <Box sx={PERMIT_RIGHT_BOX_STYLE}>
        <Box sx={{ gap: "40px", paddingTop: "24px" }}>
          <Typography sx={{ fontWeight: "bold" }}>Unit #</Typography>
          <Typography>TODO</Typography>
          <Typography sx={{ fontWeight: "bold" }}>VIN</Typography>
          <Typography>{values?.application.vehicleDetails?.vin}</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Plate</Typography>
          <Typography>{values?.application.vehicleDetails?.plate}</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Make</Typography>
          <Typography>{values?.application.vehicleDetails?.make}</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Year</Typography>
          <Typography>{values?.application.vehicleDetails?.year}</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Country</Typography>
          <Typography>
            {values?.application.vehicleDetails?.countryCode}
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>Province / State</Typography>
          <Typography>
            {values?.application.vehicleDetails?.provinceCode}
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>Vehicle Type</Typography>
          <Typography>
            {values?.application.vehicleDetails?.vehicleType}
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>Vehicle Sub-type</Typography>
          <Typography>
            {values?.application.vehicleDetails?.vehicleSubType}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const FeeSummary = () => {
  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography variant={"h3"} sx={PERMIT_LEFT_HEADER_STYLE}></Typography>
      </Box>
      <Box sx={PERMIT_RIGHT_BOX_STYLE}>
        <Box sx={{ gap: "40px", paddingTop: "24px" }}>
          <FeeSummaryBanner />
          <ConfirmationCheckboxes />
        </Box>
      </Box>
    </Box>
  );
};

export const FeeSummaryBanner = () => {
  return (
    <Box
      sx={{
        backgroundColor: BC_COLOURS.banner_grey,
        color: BC_COLOURS.bc_primary_blue,
        p: 3,
        width: "642px",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          paddingBottom: "8px",
        }}
      >
        Fee Summary
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          fontWeight: "bold",
          padding: "16px 0",
        }}
      >
        <Typography variant="h6">Description</Typography>
        <Typography variant="h6">Price ($CAD)</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "16px 0",
          borderTop: `2px solid ${BC_COLOURS.bc_text_box_border_grey}`,
          borderBottom: `2px solid ${BC_COLOURS.bc_text_box_border_grey}`,
        }}
      >
        <Typography variant="h6">Term Oversize Permit</Typography>
        <Typography variant="h6">$30.00</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: "16px",
        }}
      >
        <Typography variant="h4">Total</Typography>
        <Typography variant="h4">$30.00</Typography>
      </Box>
    </Box>
  );
};

export const ConfirmationCheckboxes = () => {
  const checkboxes = [
    {
      description:
        "I confirm that this permit is issued to the registered owner (or lessee) of the vehicle being permitted.",
      checked: false,
    },
    {
      description:
        "I confirm I am compliant with the appropriate policy for my selected commodity(s).",
      checked: false,
    },
    {
      description: "I confirm the information in this application is correct.",
      checked: false,
    },
  ];
  const [checked, setChecked] = useState(checkboxes);

  const handleCheck = (checkedName: string) => {
    const updated = checked.map((item) => {
      if (item.description === checkedName) {
        item.checked = !item.checked;
      }
      return item;
    });
    setChecked(updated);
  };

  const {
    register,
    formState: { isValid, isSubmitted },
  } = useFormContext();

  return (
    <Box sx={{ paddingTop: "24px" }}>
      {checked.map((x, index) => (
        <Box key={x.description}>
          <Checkbox
            {...register(`checkbox #${index}`, { required: true })}
            key={x.description}
            checked={x.checked}
            onChange={() => handleCheck(x.description)}
            sx={{
              color:
                isSubmitted && !isValid && !x.checked
                  ? BC_COLOURS.bc_red
                  : BC_COLOURS.bc_primary_blue,
            }}
          />
          {x.description}
        </Box>
      ))}
      {isSubmitted && !isValid ? (
        <Typography sx={{ color: BC_COLOURS.bc_red }}>
          Checkbox selection is required.
        </Typography>
      ) : null}
    </Box>
  );
};
