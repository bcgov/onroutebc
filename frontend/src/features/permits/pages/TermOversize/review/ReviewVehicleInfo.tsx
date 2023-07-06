import { Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

import { Application } from "../../../types/application";
import {
  formatCountry,
  formatProvince,
} from "../../../../../common/helpers/formatCountryProvince";
import {
  usePowerUnitTypesQuery,
  useTrailerTypesQuery,
} from "../../../../manageVehicles/apiManager/hooks";
import { mapTypeCodeToObject } from "../../../helpers/mappers";
import "./ReviewVehicleInfo.scss";

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
    <Box className="review-vehicle-info">
      <Box className="review-vehicle-info__header">
        <Typography variant={"h3"}>
          Vehicle Information
        </Typography>
      </Box>
      <Box className="review-vehicle-info__body">
        <Box className="info-section">
          <Typography className="info-section__label">
            Unit #
          </Typography>
          <Typography className="info-section__data">
            {values?.permitData.vehicleDetails?.unitNumber}
          </Typography>
          <Typography className="info-section__label">
            VIN <span className="info-section__label--indicator">(last 6 digits)</span>
          </Typography>
          <Typography className="info-section__data">
            {values?.permitData.vehicleDetails?.vin}
          </Typography>
          <Typography className="info-section__label">
            Plate
          </Typography>
          <Typography className="info-section__data">
            {values?.permitData.vehicleDetails?.plate}
          </Typography>
          <Typography className="info-section__label">
            Make
          </Typography>
          <Typography className="info-section__data">
            {values?.permitData.vehicleDetails?.make}
          </Typography>
          <Typography className="info-section__label">
            Year
          </Typography>
          <Typography className="info-section__data">
            {values?.permitData.vehicleDetails?.year}
          </Typography>
          <Typography className="info-section__label">
            Country
          </Typography>
          <Typography className="info-section__data">
            {formatCountry(values?.permitData.vehicleDetails?.countryCode)}
          </Typography>
          <Typography className="info-section__label">
            Province / State
          </Typography>
          <Typography className="info-section__data">
            {formatProvince(
              values?.permitData.vehicleDetails?.countryCode,
              values?.permitData.vehicleDetails?.provinceCode
            )}
          </Typography>
          <Typography className="info-section__label">
            Vehicle Type
          </Typography>
          <Typography className="info-section__data">
            {DisplayVehicleType()}
          </Typography>
          <Typography className="info-section__label">
            Vehicle Sub-type
          </Typography>
          <Typography className="info-section__data">
            {DisplayVehicleSubType()}
          </Typography>
          {values?.permitData.vehicleDetails?.saveVehicle && (
            <Typography className="info-section__msg">
              <FontAwesomeIcon className="icon" icon={faCircleCheck} />
              This vehicle has been added/updated to your Vehicle Inventory.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
