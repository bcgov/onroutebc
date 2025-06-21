import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

import "./PowerUnitInfo.scss";
import { PermitVehicleDetails } from "../../../../../types/PermitVehicleDetails";
import { PowerUnitInfoDisplay } from "../../common/PowerUnitInfoDisplay";

export const PowerUnitInfo = ({
  powerUnitInfo,
  powerUnitSubtypeNamesMap,
  onRemovePowerUnit,
  onEditPowerUnit,
}: {
  powerUnitInfo: PermitVehicleDetails;
  powerUnitSubtypeNamesMap: Map<string, string>;
  onRemovePowerUnit: () => void,
  onEditPowerUnit: () => void,
}) => {
  return (
    <div className="power-unit-info">
      <h4 className="power-unit-info__title">Power Unit</h4>

      <PowerUnitInfoDisplay
        powerUnitInfo={powerUnitInfo}
        powerUnitSubtypeNamesMap={powerUnitSubtypeNamesMap}
      />

      <div className="power-unit-info__actions">
        <Button
          key="remove-power-unit-button"
          className="power-unit-info__action-btn power-unit-info__action-btn--remove"
          aria-label="Remove"
          variant="contained"
          color="tertiary"
          onClick={onRemovePowerUnit}
          data-testid="remove-power-unit-button"
        >
          Remove
        </Button>

        <Button
          className="power-unit-info__action-btn power-unit-info__action-btn--edit"
          key="edit-power-unit-button"
          aria-label="Edit"
          variant="contained"
          color="tertiary"
          onClick={onEditPowerUnit}
        >
          <FontAwesomeIcon
            className="power-unit-info__button-icon"
            icon={faPencil}
          />
          Edit
        </Button>
      </div>
    </div>
  );
};
