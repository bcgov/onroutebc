import { Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";

import "./ReviewVehicleInfo.scss";
import { VehicleDetails } from "../../../../types/application";
import { mapTypeCodeToObject, vehicleTypeDisplayText } from "../../../../helpers/mappers";
import { VehicleType, VehicleTypesAsString } from "../../../../../manageVehicles/types/managevehicles";
import {
  formatCountry,
  formatProvince,
} from "../../../../../../common/helpers/formatCountryProvince";

export const ReviewVehicleInfo = ({
  vehicleDetails,
  vehicleWasSaved,
  powerUnitTypes,
  trailerTypes,
}: {
  vehicleDetails?: VehicleDetails;
  vehicleWasSaved?: boolean;
  powerUnitTypes?: VehicleType[];
  trailerTypes?: VehicleType[];
}) => {
  const DisplayVehicleType = () => {
    const vehicleTypeCode = vehicleDetails?.vehicleType;
    if (!vehicleTypeCode) return "";
    return vehicleTypeDisplayText(vehicleTypeCode as VehicleTypesAsString);
  };

  const DisplayVehicleSubType = () => {
    const code = vehicleDetails?.vehicleSubType;
    const vehicleTypeCode = vehicleDetails?.vehicleType;

    if (!code || !vehicleTypeCode) return "";

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
            {vehicleDetails?.unitNumber}
          </Typography>
          <Typography className="info-section__label">
            VIN <span className="info-section__label--indicator">(last 6 digits)</span>
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-vin"
          >
            {vehicleDetails?.vin}
          </Typography>
          <Typography className="info-section__label">
            Plate
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-plate"
          >
            {vehicleDetails?.plate}
          </Typography>
          <Typography className="info-section__label">
            Make
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-make"
          >
            {vehicleDetails?.make}
          </Typography>
          <Typography className="info-section__label">
            Year
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-year"
          >
            {vehicleDetails?.year}
          </Typography>
          <Typography className="info-section__label">
            Country
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-country"
          >
            {formatCountry(vehicleDetails?.countryCode)}
          </Typography>
          <Typography className="info-section__label">
            Province / State
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-province"
          >
            {formatProvince(
              vehicleDetails?.countryCode,
              vehicleDetails?.provinceCode
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
          {vehicleWasSaved && (
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
