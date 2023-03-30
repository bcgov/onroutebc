import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Box, Button, MenuItem, Typography } from "@mui/material";
import { CountryAndProvince } from "../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import { useNavigate } from "react-router-dom";
import { TermOversizePermit } from "../../types/permits";
import { usePowerUnitTypesQuery } from "../../../manageVehicles/apiManager/hooks";
import { VehicleType } from "../../../manageVehicles/types/managevehicles";
import { useSubmitTermOversizeMutation } from "../../apiManager/hooks";
import { ContactDetails } from "./ContactDetails";

/**
 * @returns React component containing the form for adding or editing a power unit.
 */
export const TermOversizeForm = () => {
  // Default values to register with React Hook Forms
  // If data was passed to this component, then use that data, otherwise use empty or undefined values
  const termOversizeDefaultValues = {};

  const formMethods = useForm<TermOversizePermit>({
    defaultValues: termOversizeDefaultValues,
    reValidateMode: "onBlur",
  });

  const { handleSubmit } = formMethods;

  const powerUnitTypesQuery = usePowerUnitTypesQuery();
  const submitTermOversizeQuery = useSubmitTermOversizeMutation();
  const navigate = useNavigate();

  /**
   * Custom css overrides for the form fields
   */
  const formFieldStyle = {
    fontWeight: "bold",
    width: "490px",
    marginLeft: "8px",
  };

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
        <ContactDetails feature={FEATURE} />
      </FormProvider>

      <Box sx={{ padding: "32px 0px" }}>
        <Button
          key="cancel-add-vehicle-button"
          aria-label="Cancel Add Vehicle"
          variant="contained"
          color="secondary"
          onClick={handleClose}
          sx={{ marginRight: "32px" }}
        >
          Cancel
        </Button>
        <Button
          key="add-vehicle-button"
          aria-label="Add To Inventory"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmitTermOversize)}
        >
          Add To Inventory
        </Button>
      </Box>
    </div>
  );
};
