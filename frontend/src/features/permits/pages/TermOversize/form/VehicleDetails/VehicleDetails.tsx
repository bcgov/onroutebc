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
import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";

import { CountryAndProvince } from "../../../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";
import { InfoBcGovBanner } from "../../../../../../common/components/banners/AlertBanners";
import { VehicleDetails as VehicleDetailsType } from "../../../../types/application";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../../../themes/orbcStyles";

import { SelectPowerUnitOrTrailer } from "./customFields/SelectPowerUnitOrTrailer";
import { SelectVehicleDropdown } from "./customFields/SelectVehicleDropdown";
import {
  CHOOSE_FROM_OPTIONS,
  VEHICLE_TYPES,
} from "../../../../constants/constants";

import { 
  invalidNumber, 
  invalidPlateLength, 
  invalidVINLength, 
  invalidYearMin, 
  requiredMessage 
} from "../../../../../../common/helpers/validationMessages";
import { PowerUnit, Trailer, Vehicle, VehicleType } from "../../../../../manageVehicles/types/managevehicles";
import { mapVinToVehicleObject } from "../../../../helpers/mappers";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { sortVehicleSubTypes } from "../../../../helpers/sorter";
import { removeIneligibleVehicleSubTypes } from "../../../../helpers/removeIneligibleVehicles";
import { TROS_INELIGIBLE_POWERUNITS, TROS_INELIGIBLE_TRAILERS } from "../../../../constants/termOversizeConstants";

export const VehicleDetails = ({ 
  feature, 
  vehicleData,
  vehicleOptions,
  powerUnitTypes,
  trailerTypes,
}: { 
  feature: string;
  vehicleData?: VehicleDetailsType;
  vehicleOptions: (PowerUnit | Trailer)[];
  powerUnitTypes: VehicleType[];
  trailerTypes: VehicleType[];
}) => {
  const formFieldStyle = {
    fontWeight: "bold",
    width: "490px",
    marginLeft: "8px",
  };

  const { setValue, resetField } = useFormContext();

  // Choose vehicle based on either Unit Number or Plate
  const [chooseFrom, setChooseFrom] = useState("");
  // Radio button value to decide if the user wants to save the vehicle in inventory
  const [saveVehicle, setSaveVehicle] = useState(false);
  const [subtypeOptions, setSubtypeOptions] = useState<VehicleType[]>([]);

  const getSubtypeOptions = (vehicleType: string) => {
    if (vehicleType === "powerUnit") {
      return [...powerUnitTypes];
    }
    if (vehicleType === "trailer") {
      return [...trailerTypes];
    }
    return [];
  };

  const getEligibleSubtypeOptions = (vehicleType?: string) => {
    if (vehicleType !== "powerUnit" && vehicleType !== "trailer") {
      return [];
    }

    // Sort vehicle subtypes alphabetically
    const sortedVehicles = sortVehicleSubTypes(
      vehicleType, 
      getSubtypeOptions(vehicleType)
    );

    // Temporary method to remove ineligible vehicles as per TROS policy.
    // Will be replaced by backend endpoint with optional query parameter
    const eligibleVehicleSubtypes = removeIneligibleVehicleSubTypes(
      sortedVehicles,
      vehicleType,
      TROS_INELIGIBLE_POWERUNITS,
      TROS_INELIGIBLE_TRAILERS
    );

    return eligibleVehicleSubtypes
  };

  // Update subtype options whenever application data (from context) changes
  // or powerUnitTypes/trailerTypes are queried from backend
  useEffect(() => {
    const subtypes = getEligibleSubtypeOptions(
      getDefaultRequiredVal("", vehicleData?.vehicleType)
    );
    setSubtypeOptions(subtypes);
  }, [vehicleData?.vehicleType, powerUnitTypes, trailerTypes]);

  const resetSubtype = (updatedVehicleType?: string) => {
    // Update subtype options when vehicle type changes
    const subtypes = getEligibleSubtypeOptions(updatedVehicleType);
    setSubtypeOptions(subtypes);

    resetField("permitData.vehicleDetails.vehicleSubType", { defaultValue: "" });
  };

  const clearVehicle = () => {
    // Must reset each specific field this way
    resetField("permitData.vehicleDetails.unitNumber", { defaultValue: "" });
    resetField("permitData.vehicleDetails.vin", { defaultValue: "" });
    resetField("permitData.vehicleDetails.plate", { defaultValue: "" });
    resetField("permitData.vehicleDetails.make", { defaultValue: "" });
    resetField("permitData.vehicleDetails.year", { defaultValue: "" });
    resetField("permitData.vehicleDetails.countryCode", { defaultValue: "" });
    resetField("permitData.vehicleDetails.provinceCode", { defaultValue: "" });
    resetField("permitData.vehicleDetails.vehicleType", { defaultValue: "" });
    resetSubtype("");
  };

  const onSelectVehicle = (selectedVehicle: Vehicle) => {
    const vehicle = mapVinToVehicleObject(vehicleOptions, selectedVehicle.vin);
    if (!vehicle) {
      clearVehicle();
      return;
    }

    const vehicleDetails = {
      unitNumber: vehicle.unitNumber,
      vin: vehicle.vin,
      plate: vehicle.plate,
      make: vehicle.make,
      year: vehicle.year,
      countryCode: vehicle.countryCode,
      provinceCode: vehicle.provinceCode,
      vehicleType: vehicle.vehicleType,
      vehicleSubType: vehicle.vehicleType === "powerUnit" ?
        (vehicle as PowerUnit).powerUnitTypeCode : (
          vehicle.vehicleType === "trailer" ? 
            (vehicle as Trailer).trailerTypeCode : ""
        )
    };
    
    clearVehicle();
    setSubtypeOptions(
      getEligibleSubtypeOptions(vehicle.vehicleType)
    );
    setValue("permitData.vehicleDetails", vehicleDetails);
  };

  // Set the 'Save to Inventory' radio button to false on render
  useEffect(() => {
    handleSaveVehicleRadioBtns("false");
  }, []);

  const handleChooseFrom = (event: SelectChangeEvent) => {
    setChooseFrom(event.target.value as string);
  };

  const handleSaveVehicleRadioBtns = (isSave: string) => {
    const isTrue = isSave === "true";
    setSaveVehicle(isTrue);
    setValue("permitData.vehicleDetails.saveVehicle", isTrue);
  };

  // Reset the vehicle sub type field if the vehicle type field changes
  const handleChangeVehicleType = (event: SelectChangeEvent) => {
    const updatedVehicleType = event.target.value as string;
    setValue("permitData.vehicleDetails.vehicleType", updatedVehicleType);

    resetSubtype(updatedVehicleType);
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
            vehicleOptions={vehicleOptions}
            handleClearVehicle={clearVehicle}
            handleSelectVehicle={onSelectVehicle}
          />
        </Box>

        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "permitData.vehicleDetails.vin",
            rules: {
              required: { value: true, message: requiredMessage() },
              minLength: { value: 6, message: invalidVINLength(6) },
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
            name: "permitData.vehicleDetails.plate",
            rules: { 
              required: { value: true, message: requiredMessage() }, 
              maxLength: { value: 10, message: invalidPlateLength(10) },
            },
            label: "Plate",
            width: formFieldStyle.width,
          }}
          i18options={{
            label_i18: "vehicle.power-unit.plate",
          }}
        />

        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "permitData.vehicleDetails.make",
            rules: { 
              required: { value: true, message: requiredMessage() }, 
              maxLength: 20 
            },
            label: "Make",
            width: formFieldStyle.width,
          }}
          i18options={{
            label_i18: "vehicle.power-unit.make",
          }}
        />

        <CustomFormComponent
          type="input"
          feature={feature}
          options={{
            name: "permitData.vehicleDetails.year",
            rules: {
              required: { value: true, message: requiredMessage() },
              valueAsNumber: true,
              maxLength: 4,
              validate: {
                isNumber: (v) => !isNaN(v) || invalidNumber(),
                lessThan1950: (v) =>
                  parseInt(v) > 1950 || invalidYearMin(1950),
              },
            },
            label: "Year",
            width: formFieldStyle.width,
          }}
        />

        <CountryAndProvince
          feature={feature}
          countryField="permitData.vehicleDetails.countryCode"
          provinceField="permitData.vehicleDetails.provinceCode"
          isProvinceRequired={true}
          width={formFieldStyle.width}
        />

        <CustomFormComponent
          type="select"
          feature={feature}
          options={{
            name: "permitData.vehicleDetails.vehicleType",
            rules: {
              required: {
                value: true,
                message: requiredMessage(),
              },
              onChange: handleChangeVehicleType,
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

        <CustomFormComponent
          type="select"
          feature={feature}
          options={{
            name: "permitData.vehicleDetails.vehicleSubType",
            rules: {
              required: { value: true, message: requiredMessage() },
            },
            label: "Vehicle Sub-type",
            width: formFieldStyle.width,
          }}
          menuOptions={subtypeOptions.map((subtype) => (
            <MenuItem key={subtype.typeCode} value={subtype.typeCode}>
              {subtype.type}
            </MenuItem>
          ))}
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
