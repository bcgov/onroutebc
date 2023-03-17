import { useForm, FormProvider, FieldValues } from "react-hook-form";
import { Box, Button, MenuItem } from "@mui/material";
import "./VehicleForm.scss";
// import { AxleGroupForm } from "./AxleGroupForm";
import { Trailer, VehicleType } from "../../types/managevehicles";
import { CountryAndProvince } from "../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import {
  useAddTrailerMutation,
  useTrailerTypesQuery,
} from "../../apiManager/hooks";
import { useNavigate } from "react-router-dom";

/**
 * Props used by the power unit form.
 */
interface TrailerFormProps {
  trailer?: Trailer;

  /**
   * The trailer id to be retrieved.
   * If valid and available, the form will be in an editable state.
   */
  trailerId?: string;
}

/**
 * @returns React component containing the form for adding or editing a power unit.
 */
export const TrailerForm = ({ trailer }: TrailerFormProps) => {
  // Default values to register with React Hook Forms
  // If data was passed to this component, then use that data, otherwise use empty or undefined values
  const trailerDefaultValues = {
    country: trailer?.provinceId ? trailer?.provinceId?.split("-")[0] : "",
    province: trailer?.provinceId ? trailer?.provinceId?.split("-")[1] : "",
    unitNumber: trailer?.unitNumber || "",
    make: trailer?.make || "",
    plate: trailer?.plate || "",
    trailerTypeCode: trailer?.trailerTypeCode || "",
    provinceId: trailer?.provinceId ? trailer?.provinceId : "",
    vin: trailer?.vin ? trailer?.vin : "",
    year: trailer?.year ? trailer?.year : undefined,
    emptyTrailerWidth: trailer?.emptyTrailerWidth
      ? trailer?.emptyTrailerWidth
      : undefined,
  };

  const formMethods = useForm<Trailer>({
    defaultValues: trailerDefaultValues,
    reValidateMode: "onBlur",
  });

  const { handleSubmit } = formMethods;

  const trailerTypesQuery = useTrailerTypesQuery();
  const addVehicleQuery = useAddTrailerMutation();
  const navigate = useNavigate();

  /**
   * Custom css overrides for the form fields
   */
  const formFieldStyle = {
    fontWeight: "bold",
    width: "490px",
    marginLeft: "8px",
  };

  /**
   * Adds a vehicle.
   */
  const onAddVehicle = function (data: FieldValues) {
    const trailerToBeAdded = data as Trailer;
    addVehicleQuery.mutate(trailerToBeAdded);
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
  const FEATURE = "trailer";

  return (
    <div>
      <FormProvider {...formMethods}>
        <div id="trailer-form">
          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "unitNumber",
              rules: { required: false, maxLength: 10 },
              label: "Unit #",
              width: formFieldStyle.width,
            }}
          />

          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "make",
              rules: {
                required: { value: true, message: "Make required." },
                maxLength: 20,
              },
              label: "Make",
              width: formFieldStyle.width,
            }}
          />

          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "year",
              rules: {
                required: { value: true, message: "Year is required." },
                pattern: {
                  value: /^\d+$/,
                  message: "Please enter a number",
                },
                minLength: { value: 4, message: "Min length is 4" },
                maxLength: 4,
              },
              label: "Year",
              width: formFieldStyle.width,
            }}
          />

          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "vin",
              rules: {
                required: { value: true, message: "VIN is required." },
                minLength: { value: 6, message: "Length must be 6" },
                maxLength: 6,
              },
              label: "VIN",
              width: formFieldStyle.width,
              customHelperText: "last 6 digits",
            }}
          />

          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "plate",
              rules: {
                required: { value: true, message: "Plate required." },
                maxLength: 10,
              },
              label: "Plate",
              width: formFieldStyle.width,
            }}
          />

          <CustomFormComponent
            type="select"
            feature={FEATURE}
            options={{
              name: "trailerTypeCode",
              rules: {
                required: {
                  value: true,
                  message: "Vehicle Sub-type is required.",
                },
              },
              label: "Vehicle Sub-type",
              width: formFieldStyle.width,
            }}
            menuOptions={trailerTypesQuery?.data?.map((data: VehicleType) => (
              <MenuItem key={data.typeCode} value={data.typeCode}>
                {data.type}
              </MenuItem>
            ))}
          />

          <CustomFormComponent
            type="input"
            feature={FEATURE}
            options={{
              name: "emptyTrailerWidth",
              rules: { required: false, maxLength: 10 },
              label: "Empty Trailer Width (m)",
              width: formFieldStyle.width,
            }}
          />

          <CountryAndProvince
            feature={FEATURE}
            countryField="country"
            provinceField="province"
            isProvinceRequired={false}
            provinceIdField="provinceId"
            width={formFieldStyle.width}
          />
        </div>
        {/* {getAxleGroupForms()} */}
      </FormProvider>

      <Box sx={{ margin: "32px 0px" }}>
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
          onClick={handleSubmit(onAddVehicle)}
        >
          Add To Inventory
        </Button>
      </Box>
    </div>
  );
};
