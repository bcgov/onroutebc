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
import { CountryAndProvince } from "../../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../../common/components/form/CustomFormComponents";
import {
  PowerUnit,
  Trailer,
} from "../../../../manageVehicles/types/managevehicles";
import {
  usePowerUnitTypesQuery,
  useTrailerTypesQuery,
  useVehiclesQuery,
} from "../../../../manageVehicles/apiManager/hooks";
import { InfoBcGovBanner } from "../../../../../common/components/banners/AlertBanners";
import { useContext, useEffect, useState } from "react";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../../themes/orbcStyles";
import { useFormContext } from "react-hook-form";
import { CustomSimpleSelect } from "../../../../../common/components/form/subFormComponents/CustomSimpleSelect";
import { CustomSimpleSelectWithRegister } from "../../../../../common/components/form/subFormComponents/CustomSimpleSelectWithRegister";
import { SelectVehicleDropdown } from "./customFields/SelectVehicleDropdown";
import { SelectVehicleSubTypeDropdown } from "./customFields/SelectVehicleSubTypeDropdown";
import { ApplicationContext } from "../../../context/ApplicationContext";

export const VehicleDetails = ({ feature }: { feature: string }) => {
  const {
    setValue,
    resetField,
    register,
    formState: { isDirty },
  } = useFormContext();

  const formFieldStyle = {
    fontWeight: "bold",
    width: "490px",
    marginLeft: "8px",
  };

  const powerUnitTypesQuery = usePowerUnitTypesQuery();
  const trailerTypesQuery = useTrailerTypesQuery();
  const allVehiclesQuery = useVehiclesQuery();
  const { applicationData, setApplicationData } =
    useContext(ApplicationContext);

  const chooseFromOptions = [
    { value: "unitNumber", label: "Unit Number" },
    { value: "plate", label: "Plate" },
  ];

  const vehicleTypes = [
    { value: "powerUnit", label: "Power Unit" },
    { value: "trailer", label: "Trailer" },
  ];

  const [chooseFrom, setChooseFrom] = useState("");
  // Selected vehicle is the selected vehicles plate number
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [saveVehicle, setSaveVehicle] = useState(false);

  useEffect(() => {
    handleSaveVehicleRadioBtns("false");
  }, []);

  useEffect(() => {
    if (applicationData) {
      setSelectedVehicle(
        applicationData?.application.vehicleDetails?.plate || ""
      );
    }

    // Populate the 'Vehicle Type' and 'Vehicle Sub Type' form fields with the selected vehicle information

    if (
      applicationData?.application.vehicleDetails?.vehicleType === "powerUnit"
    ) {
      setVehicleType("powerUnit");
      setValue("application.vehicleDetails.vehicleType", "powerUnit");
      setValue(
        "application.vehicleDetails.vehicleSubType",
        applicationData?.application.vehicleDetails?.vehicleSubType
      );
    }
    if (
      applicationData?.application.vehicleDetails?.vehicleType === "trailer"
    ) {
      setVehicleType("trailer");
      setValue("application.vehicleDetails.vehicleType", "trailer");
      setValue(
        "application.vehicleDetails.vehicleSubType",
        applicationData?.application.vehicleDetails?.vehicleSubType
      );
    }
  }, [applicationData]);

  useEffect(() => {
    if (!selectedVehicle) {
      setVehicleType("");
      return;
    }

    if (!isDirty && applicationData?.application.vehicleDetails?.vehicleType) {
      setVehicleType(applicationData?.application.vehicleDetails?.vehicleType);
      setValue(
        "application.vehicleDetails.vehicleType",
        applicationData?.application.vehicleDetails?.vehicleType
      );
      return;
    }

    // Get the selected vehicle object from the plate number
    const vehicle: (PowerUnit | Trailer)[] | undefined =
      allVehiclesQuery.data?.filter((item) => {
        return item.plate === selectedVehicle;
      });

    if (!vehicle || vehicle.length <= 0) return;

    // Populate the 'Vehicle Type' and 'Vehicle Sub Type' form fields with the selected vehicle information
    const powerUnit = vehicle[0] as PowerUnit;
    if (powerUnit.powerUnitTypeCode) {
      setVehicleType("powerUnit");
      setValue("application.vehicleDetails.vehicleType", "powerUnit");
      setValue(
        "application.vehicleDetails.vehicleSubType",
        powerUnit.powerUnitTypeCode
      );
    }
    const trailer = vehicle[0] as Trailer;
    if (trailer.trailerTypeCode) {
      setVehicleType("trailer");
      setValue("application.vehicleDetails.vehicleType", "trailer");
      setValue(
        "application.vehicleDetails.vehicleSubType",
        trailer.trailerTypeCode
      );
    }
  }, [selectedVehicle]);

  const setVehicleSubTypeOptions = () => {
    if (vehicleType === "powerUnit") {
      return powerUnitTypesQuery?.data;
    } else if (vehicleType === "trailer") {
      return trailerTypesQuery?.data;
    }
    return undefined;
  };

  const handleChooseFrom = (event: SelectChangeEvent) => {
    setChooseFrom(event.target.value as string);
  };

  const handleVehicleType = (event: SelectChangeEvent) => {
    const updatedVehicleType = event.target.value as string;
    setVehicleType(updatedVehicleType);
    setValue("application.vehicleDetails.vehicleType", updatedVehicleType);
    const updated = applicationData;
    if (updated && updated.application.vehicleDetails) {
      updated.application.vehicleDetails.vehicleType = updatedVehicleType;
      updated.application.vehicleDetails.vehicleSubType = "";
      setApplicationData(updated);
    }
    resetField("application.vehicleDetails.vehicleSubType");
    setValue("application.vehicleDetails.vehicleSubType", "");
  };

  const handleSaveVehicleRadioBtns = (isSave: string) => {
    const isTrue = isSave === "true";
    setSaveVehicle(isTrue);
    setValue("application.vehicleDetails.saveVehicle", isTrue);
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
          <CustomSimpleSelect
            value={chooseFrom}
            label={"Choose from"}
            onChange={handleChooseFrom}
            menuItems={chooseFromOptions.map((data) => (
              <MenuItem key={data.value} value={data.value}>
                {data.label}
              </MenuItem>
            ))}
            width={"180px"}
          />
          <SelectVehicleDropdown
            label={"Select vehicle"}
            width={"268px"}
            options={allVehiclesQuery?.data}
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

        <CustomSimpleSelectWithRegister
          value={vehicleType}
          label={"Vehicle Type"}
          menuItems={vehicleTypes.map((data) => (
            <MenuItem key={data.value} value={data.value}>
              {data.label}
            </MenuItem>
          ))}
          width={formFieldStyle.width}
          registerOptions={{
            name: "application.vehicleDetails.vehicleType",
            options: {
              value: vehicleType,
              required: true,
              onChange: handleVehicleType,
            },
          }}
        />

        <SelectVehicleSubTypeDropdown
          label={"Vehicle Sub-type"}
          vehicleType={vehicleType}
          options={setVehicleSubTypeOptions()}
          width={formFieldStyle.width}
          name="application.vehicleDetails.vehicleSubType"
          rules={{
            required: { value: true, message: "Vehicle Sub-type is required." },
          }}
          powerUnitTypes={powerUnitTypesQuery?.data}
          trailerTypes={trailerTypesQuery?.data}
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
