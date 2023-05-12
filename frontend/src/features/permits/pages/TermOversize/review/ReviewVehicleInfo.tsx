import { Box, Typography } from "@mui/material";
import {
  PERMIT_MAIN_BOX_STYLE,
  PERMIT_LEFT_BOX_STYLE,
  PERMIT_LEFT_HEADER_STYLE,
  PERMIT_RIGHT_BOX_STYLE,
} from "../../../../../themes/orbcStyles";
import { Application } from "../../../types/application";
import { BC_COLOURS } from "../../../../../themes/bcGovStyles";
import {
  formatCountry,
  formatProvince,
} from "../../../../../common/helpers/formatCountryProvince";
import {
  usePowerUnitTypesQuery,
  useTrailerTypesQuery,
} from "../../../../manageVehicles/apiManager/hooks";
import { mapTypeCodeToObject } from "../../../helpers/mappers";

export const ReviewVehicleInfo = ({
  values,
}: {
  values: Application | undefined;
}) => {
  const powerUnitTypesQuery = usePowerUnitTypesQuery();
  const trailerTypesQuery = useTrailerTypesQuery();

  const DisplayVehicleType = () => {
    const vehicleTypeCode = values?.permitData.vehicleDetails?.vehicleType;
    if (vehicleTypeCode === "powerUnit") return "Power Unit";
    if (vehicleTypeCode === "trailer") return "Trailer";
    return "";
  };

  const DisplayVehicleSubType = () => {
    const code = values?.permitData.vehicleDetails?.vehicleSubType;
    const vehicleTypeCode = values?.permitData.vehicleDetails?.vehicleType;

    if (!code || !vehicleTypeCode) return "";

    const powerUnitTypes = powerUnitTypesQuery.data;
    const trailerTypes = trailerTypesQuery.data;

    const typeObject = mapTypeCodeToObject(
      code,
      vehicleTypeCode,
      powerUnitTypes,
      trailerTypes
    );

    return typeObject?.type;
  };

  return (
    <Box sx={PERMIT_MAIN_BOX_STYLE}>
      <Box sx={PERMIT_LEFT_BOX_STYLE}>
        <Typography variant={"h3"} sx={PERMIT_LEFT_HEADER_STYLE}>
          Vehicle Information
        </Typography>
      </Box>
      <Box sx={PERMIT_RIGHT_BOX_STYLE}>
        <Box sx={{ gap: "40px", paddingTop: "24px" }}>
          <Typography sx={{ fontWeight: "bold" }}>VIN</Typography>
          <Typography>{values?.permitData.vehicleDetails?.vin}</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Plate</Typography>
          <Typography>{values?.permitData.vehicleDetails?.plate}</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Make</Typography>
          <Typography>{values?.permitData.vehicleDetails?.make}</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Year</Typography>
          <Typography>{values?.permitData.vehicleDetails?.year}</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Country</Typography>
          <Typography>
            {formatCountry(values?.permitData.vehicleDetails?.countryCode)}
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>Province / State</Typography>
          <Typography>
            {formatProvince(
              values?.permitData.vehicleDetails?.countryCode,
              values?.permitData.vehicleDetails?.provinceCode
            )}
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>Vehicle Type</Typography>
          <Typography>{DisplayVehicleType()}</Typography>
          <Typography sx={{ fontWeight: "bold" }}>Vehicle Sub-type</Typography>
          <Typography>{DisplayVehicleSubType()}</Typography>
          {values?.permitData.vehicleDetails?.saveVehicle && (
            <Typography sx={{ color: BC_COLOURS.bc_green, fontWeight: "bold" }}>
              This vehicle has been added/updated to your Vehicle Inventory.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
