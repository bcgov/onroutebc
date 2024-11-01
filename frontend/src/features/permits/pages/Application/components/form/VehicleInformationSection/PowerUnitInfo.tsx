import { Button } from "@mui/material";

import "./PowerUnitInfo.scss";
import { getDefaultRequiredVal } from "../../../../../../../common/helpers/util";
import { PermitVehicleDetails } from "../../../../../types/PermitVehicleDetails";

export const PowerUnitInfo = ({
  showPowerUnitInfo,
  powerUnitInfo,
  onRemovePowerUnit,
}: {
  showPowerUnitInfo: boolean;
  powerUnitInfo: PermitVehicleDetails;
  onRemovePowerUnit: () => void,
}) => {
  return showPowerUnitInfo ? (
    <div className="power-unit-info">
      <h4 className="power-unit-info__title">Power Unit</h4>

      <div className="power-unit-info__display">
        <div className="power-unit-info__data power-unit-info__data--unit">
          <div className="power-unit-info__label">
            Unit #
          </div>

          <div className="power-unit-info__value">
            {getDefaultRequiredVal("-", powerUnitInfo.unitNumber)}
          </div>
        </div>

        <div className="power-unit-info__data power-unit-info__data--vin">
          <div className="power-unit-info__label">
            VIN (last 6 digits)
          </div>

          <div className="power-unit-info__value">
            {powerUnitInfo.vin}
          </div>
        </div>

        <div className="power-unit-info__data power-unit-info__data--plate">
          <div className="power-unit-info__label">
            Plate
          </div>

          <div className="power-unit-info__value">
            {powerUnitInfo.plate}
          </div>
        </div>

        <div className="power-unit-info__data power-unit-info__data--make">
          <div className="power-unit-info__label">
            Make
          </div>

          <div className="power-unit-info__value">
            {powerUnitInfo.make}
          </div>
        </div>

        <div className="power-unit-info__data power-unit-info__data--year">
          <div className="power-unit-info__label">
            Year
          </div>

          <div className="power-unit-info__value">
            {powerUnitInfo.year}
          </div>
        </div>

        <div className="power-unit-info__data power-unit-info__data--province">
          <div className="power-unit-info__label">
            Province / State
          </div>

          <div className="power-unit-info__value">
            {powerUnitInfo.provinceCode}
          </div>
        </div>

        <div className="power-unit-info__data power-unit-info__data--subtype">
          <div className="power-unit-info__label">
            Vehicle Sub-type
          </div>

          <div className="power-unit-info__value">
            {powerUnitInfo.vehicleSubType}
          </div>
        </div>

        <div className="power-unit-info__data power-unit-info__data--gvw">
          <div className="power-unit-info__label">
            Licensed GVW (kg)
          </div>

          <div className="power-unit-info__value">
            {getDefaultRequiredVal(0, powerUnitInfo.licensedGVW)}
          </div>
        </div>
      </div>

      <Button
        key="remove-power-unit-button"
        className="power-unit-info__remove-btn"
        aria-label="Remove"
        variant="contained"
        color="tertiary"
        onClick={onRemovePowerUnit}
        data-testid="remove-power-unit-button"
      >
        Remove
      </Button>
    </div>
  ) : null;
};
