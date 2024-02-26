import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
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

import "./VehicleDetails.scss";
import { CountryAndProvince } from "../../../../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../../../../common/components/form/CustomFormComponents";
import { InfoBcGovBanner } from "../../../../../../../common/components/banners/InfoBcGovBanner";
import { VehicleDetails as VehicleDetailsType } from "../../../../../types/application";
import { mapToVehicleObjectById } from "../../../../../helpers/mappers";
import { getDefaultRequiredVal } from "../../../../../../../common/helpers/util";
import { sortVehicleSubTypes } from "../../../../../helpers/sorter";
import { removeIneligibleVehicleSubTypes } from "../../../../../helpers/removeIneligibleVehicles";
import { CustomInputHTMLAttributes } from "../../../../../../../common/types/formElements";
import { SelectUnitOrPlate } from "./customFields/SelectUnitOrPlate";
import { SelectVehicleDropdown } from "./customFields/SelectVehicleDropdown";
import { BANNER_MESSAGES } from "../../../../../../../common/constants/bannerMessages";
import { Optional } from "../../../../../../../common/types/common";
import {
  PowerUnit,
  Trailer,
  BaseVehicle,
  VehicleSubType,
  VEHICLE_TYPES,
  Vehicle,
  VehicleType,
} from "../../../../../../manageVehicles/types/Vehicle";

import {
  TROS_INELIGIBLE_POWERUNITS,
  TROS_INELIGIBLE_TRAILERS,
} from "../../../../../constants/termOversizeConstants";

import {
  CHOOSE_FROM_OPTIONS,
  VEHICLE_CHOOSE_FROM,
  VEHICLE_TYPE_OPTIONS,
  VehicleChooseFrom,
} from "../../../../../constants/constants";

import {
  invalidNumber,
  invalidPlateLength,
  invalidVINLength,
  invalidYearMin,
  requiredMessage,
} from "../../../../../../../common/helpers/validationMessages";

const selectedVehicleSubtype = (vehicle: BaseVehicle) => {
  switch (vehicle.vehicleType) {
    case VEHICLE_TYPES.POWER_UNIT:
      return (vehicle as PowerUnit).powerUnitTypeCode;
    case VEHICLE_TYPES.TRAILER:
      return (vehicle as Trailer).trailerTypeCode;
    default:
      return "";
  }
};

export const VehicleDetails = ({
  feature,
  vehicleData,
  vehicleOptions,
  powerUnitSubTypes,
  trailerSubTypes,
}: {
  feature: string;
  vehicleData?: VehicleDetailsType;
  vehicleOptions: Vehicle[];
  powerUnitSubTypes: VehicleSubType[];
  trailerSubTypes: VehicleSubType[];
}) => {
  const formFieldStyle = {
    fontWeight: "bold",
    width: "490px",
    marginLeft: "8px",
  };

  const emptyVehicleSubtype = {
    typeCode: "",
    type: "",
    description: "",
  };

  const DEFAULT_VEHICLE_TYPE = VEHICLE_TYPES.POWER_UNIT;

  const emptyVehicleDetails = {
    vehicleId: "",
    unitNumber: "",
    vin: "",
    plate: "",
    make: "",
    year: undefined,
    countryCode: "",
    provinceCode: "",
    vehicleType: DEFAULT_VEHICLE_TYPE,
    vehicleSubType: "",
  };

  const { setValue, watch } = useFormContext();

  const typeValue = watch("permitData.vehicleDetails.vehicleType");

  // Choose vehicle based on either Unit Number or Plate
  const [chooseFrom, setChooseFrom] = useState<VehicleChooseFrom>(
    VEHICLE_CHOOSE_FROM.UNIT_NUMBER,
  );

  // Radio button value to decide if the user wants to save the vehicle in inventory
  const [saveVehicle, setSaveVehicle] = useState(false);

  // Disable vehicle type selection when a vehicle has been selected from dropdown
  // Enable only when user chooses to manually enter new vehicle info by clearing the vehicle details
  const [disableVehicleTypeSelect, setDisableVehicleTypeSelect] =
    useState(false);

  // Options for the vehicle subtype field (based on vehicle type)
  const [subtypeOptions, setSubtypeOptions] = useState<VehicleSubType[]>([
    emptyVehicleSubtype,
  ]);

  const [selectedVehicle, setSelectedVehicle] =
    useState<Optional<VehicleDetailsType>>();

  useEffect(() => {
    // Update subtype options when vehicle type changes
    const subtypes = getEligibleSubtypeOptions(typeValue);
    setSubtypeOptions(subtypes);
  }, [typeValue, powerUnitSubTypes, trailerSubTypes]);

  // Whenever context changes, set selected Vehicle details
  useEffect(() => {
    setSelectedVehicle(vehicleData);
  }, [vehicleData]);

  useEffect(() => {
    if (!selectedVehicle?.vin) {
      clearVehicleForm();
    } else {
      setNewVehicle(selectedVehicle);
    }
  }, [selectedVehicle]);

  useEffect(() => {
    const existingVehicle = vehicleData?.vehicleType
      ? mapToVehicleObjectById(
          vehicleOptions,
          vehicleData.vehicleType as VehicleType,
          vehicleData?.vehicleId,
        )
      : undefined;

    if (existingVehicle) {
      setDisableVehicleTypeSelect(true);
    } else {
      setDisableVehicleTypeSelect(false);
    }
  }, [vehicleData, vehicleOptions]);

  // Returns correct subtype options based on vehicle type
  const getSubtypeOptions = (vehicleType: string) => {
    if (vehicleType === VEHICLE_TYPES.POWER_UNIT) {
      return [...powerUnitSubTypes];
    }
    if (vehicleType === VEHICLE_TYPES.TRAILER) {
      return [...trailerSubTypes];
    }
    return [emptyVehicleSubtype];
  };

  // Returns eligible subset of subtype options to be used by select field for vehicle subtype
  const getEligibleSubtypeOptions = (vehicleType?: string) => {
    if (
      vehicleType !== VEHICLE_TYPES.POWER_UNIT &&
      vehicleType !== VEHICLE_TYPES.TRAILER
    ) {
      return [emptyVehicleSubtype];
    }

    // Sort vehicle subtypes alphabetically
    const sortedVehicles = sortVehicleSubTypes(
      vehicleType,
      getSubtypeOptions(vehicleType),
    );

    // Temporary method to remove ineligible vehicles as per TROS policy.
    // Will be replaced by backend endpoint with optional query parameter
    const eligibleVehicleSubtypes = removeIneligibleVehicleSubTypes(
      sortedVehicles,
      vehicleType,
      TROS_INELIGIBLE_POWERUNITS,
      TROS_INELIGIBLE_TRAILERS,
    );

    return eligibleVehicleSubtypes;
  };

  // Clears vehicle details fields
  const clearVehicleForm = () => {
    // Must reset each specific field this way
    setValue(
      "permitData.vehicleDetails.vehicleId",
      emptyVehicleDetails.vehicleId,
    );
    setValue(
      "permitData.vehicleDetails.unitNumber",
      emptyVehicleDetails.unitNumber,
    );
    setValue("permitData.vehicleDetails.vin", emptyVehicleDetails.vin);
    setValue("permitData.vehicleDetails.plate", emptyVehicleDetails.plate);
    setValue("permitData.vehicleDetails.make", emptyVehicleDetails.make);
    setValue(
      "permitData.vehicleDetails.year",
      getDefaultRequiredVal("", emptyVehicleDetails.year),
    );
    setValue(
      "permitData.vehicleDetails.countryCode",
      emptyVehicleDetails.countryCode,
    );
    setValue(
      "permitData.vehicleDetails.provinceCode",
      emptyVehicleDetails.provinceCode,
    );
    setValue("permitData.vehicleDetails.vehicleType", DEFAULT_VEHICLE_TYPE);
    setValue(
      "permitData.vehicleDetails.vehicleSubType",
      emptyVehicleDetails.vehicleSubType,
    );
    setDisableVehicleTypeSelect(false); // enable vehicle type selection
  };

  // Set new vehicle selection
  const setNewVehicle = (vehicle: VehicleDetailsType) => {
    setValue("permitData.vehicleDetails.vehicleId", vehicle.vehicleId);
    setValue("permitData.vehicleDetails.unitNumber", vehicle.unitNumber);
    setValue("permitData.vehicleDetails.vin", vehicle.vin);
    setValue("permitData.vehicleDetails.plate", vehicle.plate);
    setValue("permitData.vehicleDetails.make", vehicle.make);
    setValue("permitData.vehicleDetails.year", vehicle.year);
    setValue("permitData.vehicleDetails.countryCode", vehicle.countryCode);
    setValue("permitData.vehicleDetails.provinceCode", vehicle.provinceCode);
    setValue("permitData.vehicleDetails.vehicleType", vehicle.vehicleType);
    setValue(
      "permitData.vehicleDetails.vehicleSubType",
      vehicle.vehicleSubType,
    );
    setDisableVehicleTypeSelect(true); // disable vehicle type selection
  };

  // Whenever the vehicle selection is cleared
  const onClearVehicle = () => {
    setSelectedVehicle(emptyVehicleDetails as VehicleDetailsType);
  };

  // Whenever a new vehicle is selected
  const onSelectVehicle = (selectedVehicle: Vehicle) => {
    const vehicleType =
      selectedVehicle.vehicleType === VEHICLE_TYPES.TRAILER
        ? VEHICLE_TYPES.TRAILER
        : VEHICLE_TYPES.POWER_UNIT;

    const vehicleId =
      vehicleType === VEHICLE_TYPES.POWER_UNIT
        ? (selectedVehicle as PowerUnit).powerUnitId
        : (selectedVehicle as Trailer).trailerId;

    const vehicle = mapToVehicleObjectById(
      vehicleOptions,
      vehicleType,
      vehicleId,
    );

    if (!vehicle) {
      // vehicle selection is invalid
      setSelectedVehicle(undefined);
      return;
    }

    // Prepare form fields with values from selected vehicle
    const vehicleDetails = {
      vehicleId:
        vehicle.vehicleType === VEHICLE_TYPES.POWER_UNIT
          ? (vehicle as PowerUnit).powerUnitId
          : (vehicle as Trailer).trailerId,
      unitNumber: vehicle.unitNumber,
      vin: vehicle.vin,
      plate: vehicle.plate,
      make: vehicle.make,
      year: vehicle.year,
      countryCode: vehicle.countryCode,
      provinceCode: vehicle.provinceCode,
      vehicleType: getDefaultRequiredVal("", vehicle.vehicleType),
      vehicleSubType: selectedVehicleSubtype(vehicle),
    };
    setSelectedVehicle(vehicleDetails);
  };

  // Set the "Save to Inventory" radio button to false on render
  useEffect(() => {
    setValue("permitData.vehicleDetails.saveVehicle", saveVehicle);
  }, [saveVehicle]);

  const handleChooseFrom = (event: SelectChangeEvent) => {
    setChooseFrom(event.target.value as VehicleChooseFrom);
  };

  const handleSaveVehicleRadioBtns = (isSave: string) => {
    const isTrue = isSave === "true";
    setSaveVehicle(isTrue);
  };

  // Reset the vehicle subtype field whenever a different vehicle type is selected
  const handleChangeVehicleType = (event: SelectChangeEvent) => {
    const updatedVehicleType = event.target.value;
    setValue("permitData.vehicleDetails.vehicleType", updatedVehicleType);
  };

  return (
    <Box className="vehicle-details">
      <Box className="vehicle-details__header">
        <Typography variant={"h3"}>Vehicle Details</Typography>
      </Box>

      <Box className="vehicle-details__body">
        <Typography variant="h3">
          Choose a saved vehicle from your inventory or enter new vehicle
          information below.
        </Typography>

        <div className="vehicle-details__info">
          <InfoBcGovBanner
            msg={BANNER_MESSAGES.CANNOT_FIND_VEHICLE}
            additionalInfo={
              <div className="vehicle-inventory-info">
                Your vehicle may not be available in a permit application
                because it cannot be used for the type of permit you are
                applying for. <br />
                <br />
                If you are creating a new vehicle, a desired Vehicle Sub-Type
                may not be available because it is not eligible for the permit
                application you are currently in.
              </div>
            }
          />

          <div className="vehicle-details__input-section">
            <Box className="vehicle-selection">
              <SelectUnitOrPlate
                value={chooseFrom}
                label={"Choose from"}
                onChange={handleChooseFrom}
                menuItems={CHOOSE_FROM_OPTIONS.map((data) => (
                  <MenuItem key={data.value} value={data.value}>
                    {data.label}
                  </MenuItem>
                ))}
              />

              <SelectVehicleDropdown
                label={"Select vehicle"}
                chooseFrom={chooseFrom}
                selectedVehicle={selectedVehicle}
                vehicleOptions={vehicleOptions}
                handleClearVehicle={onClearVehicle}
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
            />

            <CustomFormComponent
              type="input"
              feature={feature}
              options={{
                name: "permitData.vehicleDetails.make",
                rules: {
                  required: { value: true, message: requiredMessage() },
                  maxLength: 20,
                },
                label: "Make",
                width: formFieldStyle.width,
              }}
            />

            <CustomFormComponent
              type="input"
              feature={feature}
              options={{
                name: "permitData.vehicleDetails.year",
                rules: {
                  required: { value: true, message: requiredMessage() },
                  maxLength: 4,
                  validate: {
                    isNumber: (v) => !isNaN(v) || invalidNumber(),
                    lessThan1950: (v) =>
                      parseInt(v) > 1950 || invalidYearMin(1950),
                  },
                },
                inputType: "number",
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
              readOnly={disableVehicleTypeSelect}
              disabled={disableVehicleTypeSelect}
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
              menuOptions={VEHICLE_TYPE_OPTIONS.map((data) => (
                <MenuItem
                  key={data.value}
                  value={data.value}
                  data-testid="vehicle-type-menu-item"
                >
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
                <MenuItem
                  key={subtype.typeCode}
                  value={subtype.typeCode}
                  data-testid="subtype-menu-item"
                >
                  {subtype.type}
                </MenuItem>
              ))}
            />

            <FormControl>
              <FormLabel
                id="demo-radio-buttons-group-label"
                sx={{ fontWeight: "bold", marginTop: "24px" }}
              >
                Would you like to add/update this vehicle to your Vehicle
                Inventory?
              </FormLabel>
              <RadioGroup
                aria-labelledby="radio-buttons-group-label"
                defaultValue={saveVehicle}
                value={saveVehicle}
                name="radio-buttons-group"
                onChange={(x) => handleSaveVehicleRadioBtns(x.target.value)}
              >
                <Box sx={{ display: "flex" }}>
                  <FormControlLabel
                    value={true}
                    control={
                      <Radio
                        key={`radio-save-vehicle-yes`}
                        inputProps={
                          {
                            "data-testid": "save-vehicle-yes",
                          } as CustomInputHTMLAttributes
                        }
                      />
                    }
                    label="Yes"
                  />
                  <FormControlLabel
                    value={false}
                    control={
                      <Radio
                        key={`radio-save-vehicle-no`}
                        inputProps={
                          {
                            "data-testid": "save-vehicle-no",
                          } as CustomInputHTMLAttributes
                        }
                      />
                    }
                    label="No"
                  />
                </Box>
              </RadioGroup>
            </FormControl>
          </div>
        </div>
      </Box>
    </Box>
  );
};
