import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dialog } from "@mui/material";

import "./AddPowerUnitDialog.scss";
import { VehicleDetails } from "./VehicleDetails";
import { PermitVehicleDetails } from "../../../../../types/PermitVehicleDetails";
import { Vehicle, VehicleSubType } from "../../../../../../manageVehicles/types/Vehicle";
import { PermitType } from "../../../../../types/PermitType";

export const AddPowerUnitDialog = ({
  open,
  feature,
  vehicleFormData,
  vehicleOptions,
  subtypeOptions,
  isSelectedLOAVehicle,
  permitType,
  onSetSaveVehicle,
  onSetVehicle,
  onClearVehicle,
  onCancel,
  onClickAdd,
}: {
  open: boolean;
  feature: string;
  vehicleFormData: PermitVehicleDetails;
  vehicleOptions: Vehicle[];
  subtypeOptions: VehicleSubType[];
  isSelectedLOAVehicle: boolean;
  permitType: PermitType;
  onSetSaveVehicle: (saveVehicle: boolean) => void;
  onSetVehicle: (vehicleDetails: PermitVehicleDetails) => void;
  onClearVehicle: (saveVehicle: boolean) => void;
  onCancel: () => void;
  onClickAdd: () => void;
}) => {
  return (
    <Dialog
      className="add-power-unit-dialog"
      open={open}
      onClose={onCancel}
      classes={{
        paper: "add-power-unit-dialog__container",
      }}
    >
      <div className="add-power-unit-dialog__header">
        <div className="add-power-unit-dialog__icon">
          <FontAwesomeIcon className="icon" icon={faPlus} />
        </div>

        <span className="add-power-unit-dialog__title">
          Add Power Unit
        </span>
      </div>

      <div className="add-power-unit-dialog__body">
        <VehicleDetails
          feature={feature}
          vehicleFormData={vehicleFormData}
          vehicleOptions={vehicleOptions}
          subtypeOptions={subtypeOptions}
          isSelectedLOAVehicle={isSelectedLOAVehicle}
          permitType={permitType}
          onSetSaveVehicle={onSetSaveVehicle}
          onSetVehicle={onSetVehicle}
          onClearVehicle={onClearVehicle}
        />
      </div>

      <div className="add-power-unit-dialog__btns">
        <Button
          key="cancel-button"
          aria-label="Cancel"
          variant="contained"
          color="tertiary"
          className="add-power-unit-dialog__btn add-power-unit-dialog__btn--cancel"
          onClick={onCancel}
          data-testid="cancel-button"
        >
          Cancel
        </Button>

        <Button
          key="add-power-unit-button"
          aria-label="Add"
          onClick={onClickAdd}
          className="add-power-unit-dialog__btn add-power-unit-dialog__btn--add"
          data-testid="add-power-unit-button"
        >
          Add
        </Button>
      </div>
    </Dialog>
  );
};
