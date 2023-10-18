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
import { DiffChip } from "./DiffChip";

export const ReviewVehicleInfo = ({
  vehicleDetails,
  vehicleWasSaved,
  powerUnitTypes,
  trailerTypes,
  showChangedFields = false,
  oldFields,
}: {
  vehicleDetails?: VehicleDetails;
  vehicleWasSaved?: boolean;
  powerUnitTypes?: VehicleType[];
  trailerTypes?: VehicleType[];
  showChangedFields?: boolean;
  oldFields?: VehicleDetails;
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

  const changedFields = showChangedFields ? {
    unit: (vehicleDetails?.unitNumber && !oldFields?.unitNumber) 
      || (!vehicleDetails?.unitNumber && oldFields?.unitNumber)
      || (
        vehicleDetails?.unitNumber 
        && oldFields?.unitNumber 
        && vehicleDetails.unitNumber !== oldFields.unitNumber
      ),
    vin: (vehicleDetails?.vin && !oldFields?.vin) 
      || (!vehicleDetails?.vin && oldFields?.vin)
      || (
        vehicleDetails?.vin 
        && oldFields?.vin 
        && vehicleDetails.vin !== oldFields.vin
      ),
    plate: (vehicleDetails?.plate && !oldFields?.plate) 
      || (!vehicleDetails?.plate && oldFields?.plate)
      || (
        vehicleDetails?.plate 
        && oldFields?.plate 
        && vehicleDetails.plate !== oldFields.plate
      ),
    make: (vehicleDetails?.make && !oldFields?.make) 
      || (!vehicleDetails?.make && oldFields?.make)
      || (
        vehicleDetails?.make 
        && oldFields?.make 
        && vehicleDetails.make !== oldFields.make
      ),
    year: (vehicleDetails?.year && !oldFields?.year) 
      || (!vehicleDetails?.year && oldFields?.year)
      || (
        vehicleDetails?.year 
        && oldFields?.year 
        && vehicleDetails.year !== oldFields.year
      ),
    country: (vehicleDetails?.countryCode && !oldFields?.countryCode) 
      || (!vehicleDetails?.countryCode && oldFields?.countryCode)
      || (
        vehicleDetails?.countryCode 
        && oldFields?.countryCode 
        && vehicleDetails.countryCode !== oldFields.countryCode
      ),
    province: (vehicleDetails?.provinceCode && !oldFields?.provinceCode) 
      || (!vehicleDetails?.provinceCode && oldFields?.provinceCode)
      || (
        vehicleDetails?.provinceCode 
        && oldFields?.provinceCode 
        && vehicleDetails.provinceCode !== oldFields.provinceCode
      ),
    type: (vehicleDetails?.vehicleType && !oldFields?.vehicleType) 
      || (!vehicleDetails?.vehicleType && oldFields?.vehicleType)
      || (
        vehicleDetails?.vehicleType 
        && oldFields?.vehicleType 
        && vehicleDetails.vehicleType !== oldFields.vehicleType
      ),
    subtype: (vehicleDetails?.vehicleSubType && !oldFields?.vehicleSubType) 
      || (!vehicleDetails?.vehicleSubType && oldFields?.vehicleSubType)
      || (
        vehicleDetails?.vehicleSubType 
        && oldFields?.vehicleSubType 
        && vehicleDetails.vehicleSubType !== oldFields.vehicleSubType
      ),
  } : {
    unit: false,
    vin: false,
    plate: false,
    make: false,
    year: false,
    country: false,
    province: false,
    type: false,
    subtype: false,
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
            <span className="info-section__label-text">Unit #</span>
            {changedFields.unit ? (
              <DiffChip />
            ) : null}
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-unit-number"
          >
            {vehicleDetails?.unitNumber}
          </Typography>
          <Typography className="info-section__label">
            VIN <span className="info-section__label--indicator">(last 6 digits)</span>
            {changedFields.vin ? (
              <DiffChip />
            ) : null}
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-vin"
          >
            {vehicleDetails?.vin}
          </Typography>
          <Typography className="info-section__label">
            <span className="info-section__label-text">Plate</span>
            {changedFields.plate ? (
              <DiffChip />
            ) : null}
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-plate"
          >
            {vehicleDetails?.plate}
          </Typography>
          <Typography className="info-section__label">
            <span className="info-section__label-text">Make</span>
            {changedFields.make ? (
              <DiffChip />
            ) : null}
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-make"
          >
            {vehicleDetails?.make}
          </Typography>
          <Typography className="info-section__label">
            <span className="info-section__label-text">Year</span>
            {changedFields.year ? (
              <DiffChip />
            ) : null}
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-year"
          >
            {vehicleDetails?.year}
          </Typography>
          <Typography className="info-section__label">
            <span className="info-section__label-text">Country</span>
            {changedFields.country ? (
              <DiffChip />
            ) : null}
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-country"
          >
            {formatCountry(vehicleDetails?.countryCode)}
          </Typography>
          <Typography className="info-section__label">
            <span className="info-section__label-text">
              Province / State
            </span>
            {changedFields.province ? (
              <DiffChip />
            ) : null}
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
            <span className="info-section__label-text">Vehicle Type</span>
            {changedFields.type ? (
              <DiffChip />
            ) : null}
          </Typography>
          <Typography 
            className="info-section__data"
            data-testid="review-vehicle-type"
          >
            {DisplayVehicleType()}
          </Typography>
          <Typography className="info-section__label">
            <span className="info-section__label-text">Vehicle Sub-type</span>
            {changedFields.subtype ? (
              <DiffChip />
            ) : null}
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
