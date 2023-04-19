import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { CountryAndProvince } from "../../../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";
import { InfoBcGovBanner } from "../../../../../../common/components/banners/AlertBanners";
import { useContext, useEffect, useState } from "react";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../../../themes/orbcStyles";
import { useFormContext } from "react-hook-form";
import { SelectPowerUnitOrTrailer } from "./customFields/SelectPowerUnitOrTrailer";
import { SelectVehicleDropdown } from "./customFields/SelectVehicleDropdown";
import { SelectVehicleSubTypeDropdown } from "./customFields/SelectVehicleSubTypeDropdown";
import { ApplicationContext } from "../../../../context/ApplicationContext";
import {
  CHOOSE_FROM_OPTIONS,
  VEHICLE_TYPES,
} from "../../../../constants/constants";

export const VehicleDetails = ({ feature }: { feature: string }) => {
  const formFieldStyle = {
    fontWeight: "bold",
    width: "490px",
    marginLeft: "8px",
  };

  const {
    setValue,
    formState: { isDirty },
  } = useFormContext();

  const { applicationData, setApplicationData } =
    useContext(ApplicationContext);

  // Choose vehicle based on either Unit Number or Plate
  const [chooseFrom, setChooseFrom] = useState("");
  // Selected vehicle is the selected vehicles plate number
  const [selectedVehicle, setSelectedVehicle] = useState("");
  // Radio button value to decide if the user wants to save the vehicle in inventory
  const [saveVehicle, setSaveVehicle] = useState(false);

  // Set the 'Save to Inventory' radio button to false on render
  useEffect(() => {
    handleSaveVehicleRadioBtns("false");
  }, []);

  // If the Select Vehicle dropdown changes then populate the vehicle details fields with data from that existing vehicle
  useEffect(() => {
    // If the form is initially loaded and there is application data from the application context,
    // then populate vehicle type from the application context data
    if (!isDirty && applicationData?.application.vehicleDetails?.vehicleType) {
      setValue(
        "application.vehicleDetails.vehicleType",
        applicationData?.application.vehicleDetails?.vehicleType
      );
    }
  }, [selectedVehicle]);

  const handleChooseFrom = (event: SelectChangeEvent) => {
    setChooseFrom(event.target.value as string);
  };

  const handleSaveVehicleRadioBtns = (isSave: string) => {
    const isTrue = isSave === "true";
    setSaveVehicle(isTrue);
    setValue("application.vehicleDetails.saveVehicle", isTrue);
  };

  // Reset the vehicle sub type field if the vehicle type field changes
  const handleVehicleType = (event: SelectChangeEvent) => {
    const updatedVehicleType = event.target.value as string;
    setValue("application.vehicleDetails.vehicleType", updatedVehicleType);
    const updated = applicationData;
    if (updated && updated.application.vehicleDetails) {
      updated.application.vehicleDetails.vehicleType = updatedVehicleType;
      updated.application.vehicleDetails.vehicleSubType = "";
      setApplicationData(updated);
    }
    setValue("application.vehicleDetails.vehicleSubType", "");
  };

  return (
    <Box sx={[PERMIT_MAIN_BOX_STYLE, { borderBottom: "none" }]}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography variant={"h3"} sx={PERMIT_LEFT_HEADER_STYLE}>
          Vehicle Details
        </Typography>
      </Box>
      <Box sx={PERMIT_RIGHT_BOX_STYLE}>
        <Typography variant="h3">
          Choose a saved vehicle from your inventory or enter new vehicle
          information below.
        </Typography>
        <InfoBcGovBanner
          description="Can't find a vehicle from your inventory?"
          htmlDescription={
            <p
              style={{
                fontWeight: "normal",
                fontSize: "16px",
                paddingTop: "4px",
              }}
            >
              Your vehicle may not be available in a permit application because
              it cannot be used for the type of permit you are applying for.{" "}
              <br />
              If you are creating a new vehicle, a desired Vehicle Sub-Type may
              not be available because it is not eligible for the permit
              application you are currently in.
            </p>
          }
        />
        <Box sx={{ display: "flex", gap: "40px" }}>
          <SelectPowerUnitOrTrailer
            value={chooseFrom}
            label={"Choose from"}
            onChange={handleChooseFrom}
            menuItems={CHOOSE_FROM_OPTIONS.map((data) => (
              <MenuItem key={data.value} value={data.value}>
                {data.label}
              </MenuItem>
            ))}
            width={"180px"}
          />
          <SelectVehicleDropdown
            label={"Select vehicle"}
            width={"268px"}
            chooseFrom={chooseFrom}
            setSelectedVehicle={setSelectedVehicle}
          />
        </Box>

        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "application.vehicleDetails.vin",
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
          feature={feature}
          options={{
            name: "application.vehicleDetails.plate",
            rules: { required: true, maxLength: 10 },
            label: "Plate",
            width: formFieldStyle.width,
          }}
          i18options={{
            label_i18: "vehicle.power-unit.plate",
            inValidMessage_i18: "vehicle.power-unit.required",
          }}
        />

        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "application.vehicleDetails.make",
            rules: { required: true, maxLength: 20 },
            label: "Make",
            width: formFieldStyle.width,
          }}
          i18options={{
            label_i18: "vehicle.power-unit.make",
            inValidMessage_i18: "vehicle.power-unit.required",
          }}
        />

        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "application.vehicleDetails.year",
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

        <CountryAndProvince
          feature={feature}
          countryField="application.vehicleDetails.countryCode"
          provinceField="application.vehicleDetails.provinceCode"
          isProvinceRequired={true}
          width={formFieldStyle.width}
        />

        <CustomFormComponent
          type="select"
          feature={feature}
          options={{
            name: "application.vehicleDetails.vehicleType",
            rules: {
              required: {
                value: true,
                message: "Vehicle Type is required.",
              },
              onChange: handleVehicleType,
            },
            label: "Vehicle Type",
            width: formFieldStyle.width,
          }}
          menuOptions={VEHICLE_TYPES.map((data) => (
            <MenuItem key={data.value} value={data.value}>
              {data.label}
            </MenuItem>
          ))}
        />

        <SelectVehicleSubTypeDropdown
          label={"Vehicle Sub-type"}
          width={formFieldStyle.width}
          name="application.vehicleDetails.vehicleSubType"
          rules={{
            required: { value: true, message: "Vehicle Sub-type is required." },
          }}
        />

        <FormControl>
          <FormLabel
            id="demo-radio-buttons-group-label"
            sx={{ fontWeight: "bold", marginTop: "24px" }}
          >
            Would you like to add/update this vehicle to your Vehicle Inventory?
          </FormLabel>
          <RadioGroup
            aria-labelledby="radio-buttons-group-label"
            defaultValue={saveVehicle}
            name="radio-buttons-group"
            onChange={(x) => handleSaveVehicleRadioBtns(x.target.value)}
          >
            <Box sx={{ display: "flex" }}>
              <FormControlLabel value={true} control={<Radio />} label="Yes" />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </Box>
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
};
