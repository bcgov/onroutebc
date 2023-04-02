import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TermOversizePermit } from "../../../types/permits";
import { useSubmitTermOversizeMutation } from "../../../apiManager/hooks";
import { ContactDetails } from "../ContactDetails";
import { ApplicationDetails } from "../ApplicationDetails";
import { PermitDetails } from "./PermitDetails";
import { VehicleDetails } from "../VehicleDetails";
import dayjs from "dayjs";
import { useCompanyInfoQuery } from "../../../../manageProfile/apiManager/hooks";

export const TermOversizeForm = ({
  termOversizePermit,
}: {
  termOversizePermit?: TermOversizePermit;
}) => {
  const submitTermOversizeQuery = useSubmitTermOversizeMutation();

  // Default values to register with React Hook Forms
  // If data was passed to this component, then use that data, otherwise use empty or undefined values
  const termOversizeDefaultValues: TermOversizePermit = {
    applicationId: termOversizePermit?.applicationId || 1234567,
    dateCreated: termOversizePermit?.dateCreated || dayjs(),
    lastUpdated: termOversizePermit?.lastUpdated || dayjs(),
    permitDetails: {
      startDate: termOversizePermit?.permitDetails?.startDate || dayjs(),
      endDate: termOversizePermit?.permitDetails?.endDate || "",
      permitDuration: termOversizePermit?.permitDetails?.permitDuration || 30,
      commodities: termOversizePermit?.permitDetails?.commodities || [],
    },
  };

  const formMethods = useForm<TermOversizePermit>({
    defaultValues: termOversizeDefaultValues,
    reValidateMode: "onBlur",
  });

  const { handleSubmit } = formMethods;

  const navigate = useNavigate();

  const onSubmitTermOversize = function (data: FieldValues) {
    const termOverSizeToBeAdded = data as TermOversizePermit;
    submitTermOversizeQuery.mutate(termOverSizeToBeAdded);
  };

  /**
   * Changed view to the main Vehicle Inventory page
   */
  const handleClose = () => {
    navigate("../");
  };

  /**
   * The name of this feature that is used for id's, keys, and associating form components
   */
  const FEATURE = "term-oversize";

  return (
    <div>
      <Typography
        variant={"h2"}
        sx={{
          marginRight: "200px",
          marginTop: "0px",
          paddingTop: "0px",
          borderBottom: "none",
        }}
      >
        Oversize: Term
      </Typography>
      <FormProvider {...formMethods}>
        <ApplicationDetails />
        <ContactDetails feature={FEATURE} />
        <PermitDetails feature={FEATURE} />
        <VehicleDetails feature={FEATURE} />
      </FormProvider>

      <Box sx={{ padding: "32px 0px" }}>
        <Button
          key="cancel-TROS-button"
          aria-label="Cancel"
          variant="contained"
          color="secondary"
          onClick={handleClose}
          sx={{ marginRight: "32px" }}
        >
          Cancel
        </Button>
        <Button
          key="submit-TROS-button"
          aria-label="Submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmitTermOversize)}
        >
          Submit
        </Button>
      </Box>
    </div>
  );
};
