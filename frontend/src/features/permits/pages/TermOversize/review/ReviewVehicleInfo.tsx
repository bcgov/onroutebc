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
import { mapTypeCodeToObject, vehicleTypeDisplayText } from "../../../helpers/mappers";
import "./ReviewVehicleInfo.scss";
import { VehicleTypesAsString } from "../../../../manageVehicles/types/managevehicles";

export const ReviewVehicleInfo = ({
  values,
}: {
  values: Application | undefined;
}) => {
  const powerUnitTypesQuery = usePowerUnitTypesQuery();
  const trailerTypesQuery = useTrailerTypesQuery();

  const DisplayVehicleType = () => {
    const vehicleTypeCode = values?.permitData.vehicleDetails?.vehicleType;
    if (!vehicleTypeCode) return "";
    return vehicleTypeDisplayText(vehicleTypeCode as VehicleTypesAsString);
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
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-unit-number"
          >
            {values?.permitData.vehicleDetails?.unitNumber}
          </Typography>
          <Typography className="info-section__label">
            VIN <span className="info-section__label--indicator">(last 6 digits)</span>
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-vin"
          >
            {values?.permitData.vehicleDetails?.vin}
          </Typography>
          <Typography className="info-section__label">
            Plate
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-plate"
          >
            {values?.permitData.vehicleDetails?.plate}
          </Typography>
          <Typography className="info-section__label">
            Make
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-make"
          >
            {values?.permitData.vehicleDetails?.make}
          </Typography>
          <Typography className="info-section__label">
            Year
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-year"
          >
            {values?.permitData.vehicleDetails?.year}
          </Typography>
          <Typography className="info-section__label">
            Country
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-country"
          >
            {formatCountry(values?.permitData.vehicleDetails?.countryCode)}
          </Typography>
          <Typography className="info-section__label">
            Province / State
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-province"
          >
            {formatProvince(
              values?.permitData.vehicleDetails?.countryCode,
              values?.permitData.vehicleDetails?.provinceCode
            )}
          </Typography>
          <Typography className="info-section__label">
            Vehicle Type
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-type"
          >
            {DisplayVehicleType()}
          </Typography>
          <Typography className="info-section__label">
            Vehicle Sub-type
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-subtype"
          >
            {DisplayVehicleSubType()}
          </Typography>
          {values?.permitData.vehicleDetails?.saveVehicle && (
            <Typography className="info-section__msg">
              <FontAwesomeIcon className="icon" icon={faCircleCheck} />
              <span data-testid="review-vehicle-saved-msg">
                This vehicle has been added/updated to your Vehicle Inventory.
              </span>
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
