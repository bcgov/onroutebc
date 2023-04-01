import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { BC_COLOURS } from "../../../../themes/bcGovStyles";
import { CountryAndProvince } from "../../../../common/components/form/CountryAndProvince";
import { CustomFormComponent } from "../../../../common/components/form/CustomFormComponents";
import {
  PowerUnit,
  Trailer,
  VehicleType,
} from "../../../manageVehicles/types/managevehicles";
import {
  usePowerUnitTypesQuery,
  useTrailerTypesQuery,
  useVehiclesQuery,
} from "../../../manageVehicles/apiManager/hooks";
import { InfoBcGovBanner } from "../../../../common/components/banners/AlertBanners";
import { useState } from "react";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../themes/orbcStyles";
import { useFormContext } from "react-hook-form";

export const VehicleDetails = ({ feature }: { feature: string }) => {
  const { register } = useFormContext();

  const formFieldStyle = {
    fontWeight: "bold",
    width: "490px",
    marginLeft: "8px",
  };

  const powerUnitTypesQuery = usePowerUnitTypesQuery();
  const trailerTypesQuery = useTrailerTypesQuery();
  const allVehiclesQuery = useVehiclesQuery();

  const chooseFromOptions = [
    { value: "unitNumber", label: "Unit Number" },
    { value: "plate", label: "Plate" },
  ];

  const vehicleTypes = [
    { value: "powerUnit", label: "Power Unit" },
    { value: "trailer", label: "Trailer" },
  ];

  const [chooseFrom, setChooseFrom] = useState("");
  const [vehicleType, setVehicleType] = useState("powerUnit");

  const displayVehicleMenuItems = () => {
    if (chooseFrom) {
      return allVehiclesQuery?.data?.map((data: PowerUnit | Trailer) => (
        <MenuItem key={data.plate} value={data.plate}>
          {chooseFrom == "plate" ? data.plate : data.unitNumber}
        </MenuItem>
      ));
    }
    return undefined;
  };

  const displayVehicleSubTypeMenuItems = () => {
    if (vehicleType === "powerUnit") {
      return powerUnitTypesQuery?.data?.map((data: VehicleType) => (
        <MenuItem key={data.typeCode} value={data.typeCode}>
          {data.type}
        </MenuItem>
      ));
    } else if (vehicleType === "trailer") {
      return trailerTypesQuery?.data?.map((data: VehicleType) => (
        <MenuItem key={data.typeCode} value={data.typeCode}>
          {data.type}
        </MenuItem>
      ));
    }
    return undefined;
  };

  const handleChooseFrom = (event: SelectChangeEvent) => {
    setChooseFrom(event.target.value as string);
  };

  const handleVehicleType = (event: SelectChangeEvent) => {
    setVehicleType(event.target.value as string);
  };

  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
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
          <FormControl margin="normal">
            <FormLabel sx={{ fontWeight: "bold", marginBottom: "8px" }}>
              Choose from
            </FormLabel>
            <Select
              value={chooseFrom}
              //label="Choose from"
              onChange={handleChooseFrom}
              MenuProps={{
                style: {
                  // Fix for aligning the width of menu to the dropdown
                  width: 100 % -10,
                },
              }}
              sx={{
                "&&.Mui-focused fieldset": {
                  border: `2px solid ${BC_COLOURS.focus_blue}`,
                },
                width: "180px",
              }}
            >
              {chooseFromOptions.map((data) => (
                <MenuItem key={data.value} value={data.value}>
                  {data.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <CustomFormComponent
            type="select"
            feature={feature}
            options={{
              name: "selectedVehicle",
              rules: {
                required: false,
              },
              label: "Select vehicle",
              width: "268px",
            }}
            menuOptions={displayVehicleMenuItems()}
          />
        </Box>

        <CustomFormComponent
          type="input"
          feature={feature}
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
          feature={feature}
          options={{
            name: "plate",
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
            name: "make",
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

        <CountryAndProvince
          feature={feature}
          countryField="countryCode"
          provinceField="provinceCode"
          isProvinceRequired={true}
          width={formFieldStyle.width}
        />

        <FormControl margin="normal">
          <FormLabel sx={{ fontWeight: "bold", marginBottom: "8px" }}>
            Vehicle Type
          </FormLabel>
          <Select
            //value={vehicleType}
            //onChange={handleVehicleType}
            defaultValue={"powerUnit"}
            MenuProps={{
              style: {
                // Fix for aligning the width of menu to the dropdown
                width: 100 % -10,
              },
            }}
            sx={{
              "&&.Mui-focused fieldset": {
                border: `2px solid ${BC_COLOURS.focus_blue}`,
              },
              width: formFieldStyle.width,
            }}
            {...register("vehicleType", {
              value: vehicleType,
              required: true,
              onChange: handleVehicleType,
            })}
          >
            {vehicleTypes.map((data) => (
              <MenuItem key={data.value} value={data.value}>
                {data.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <CustomFormComponent
          type="select"
          feature={feature}
          options={{
            name:
              vehicleType === "powerUnit"
                ? "powerUnitTypeCode"
                : "trailerTypeCode",
            rules: {
              required: {
                value: true,
                message: "Vehicle Sub-type is required.",
              },
            },
            label: "Vehicle Sub-type",
            width: formFieldStyle.width,
          }}
          menuOptions={displayVehicleSubTypeMenuItems()}
        />

        <FormControl>
          <FormLabel
            id="demo-radio-buttons-group-label"
            sx={{ fontWeight: "bold", marginTop: "8px" }}
          >
            Would you like to add/update this vehicle to your Vehicle Inventory?
          </FormLabel>
          <RadioGroup
            aria-labelledby="radio-buttons-group-label"
            defaultValue="no"
            name="radio-buttons-group"
          >
            <Box sx={{ display: "flex" }}>
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </Box>
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
};
