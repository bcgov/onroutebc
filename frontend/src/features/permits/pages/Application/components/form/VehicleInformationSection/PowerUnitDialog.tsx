import { useCallback } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import "./PowerUnitDialog.scss";
import { VehicleDetails } from "./VehicleDetails";
import {
  EMPTY_VEHICLE_DETAILS,
  PermitVehicleDetails,
} from "../../../../../types/PermitVehicleDetails";
import {
  Vehicle,
  VehicleSubType,
} from "../../../../../../manageVehicles/types/Vehicle";
import { PermitType } from "../../../../../types/PermitType";
import { serializePermitVehicleDetails } from "../../../../../helpers/serialize/serializePermitVehicleDetails";
import { ORBCFormFeatureType } from "../../../../../../../common/types/common";

export const PowerUnitDialog = ({
  open,
  feature,
  vehicleFormData,
  vehicleOptions,
  subtypeOptions,
  isLOAUsed,
  isSelectedLOAVehicle,
  permitType,
  onCancel,
  onSavePowerUnit,
}: {
  open: boolean;
  feature: ORBCFormFeatureType;
  vehicleFormData: PermitVehicleDetails;
  vehicleOptions: Vehicle[];
  subtypeOptions: VehicleSubType[];
  isLOAUsed: boolean;
  isSelectedLOAVehicle: boolean;
  permitType: PermitType;
  onCancel: () => void;
  onSavePowerUnit: (powerUnit: PermitVehicleDetails) => void;
}) => {
  const formMethods = useForm<{
    permitData: {
      vehicleDetails: PermitVehicleDetails;
    };
  }>({
    defaultValues: {
      permitData: {
        vehicleDetails: vehicleFormData,
      },
    },
    reValidateMode: "onChange",
  });

  const { handleSubmit, setValue, watch } = formMethods;
  const selectedVehicle = watch("permitData.vehicleDetails");

  const onToggleSaveVehicle = useCallback(
    (saveVehicle: boolean) => {
      setValue("permitData.vehicleDetails.saveVehicle", saveVehicle);
    },
    [setValue],
  );

  const onSetVehicle = useCallback(
    (vehicleDetails: PermitVehicleDetails) => {
      setValue("permitData.vehicleDetails", {
        ...vehicleDetails,
      });
    },
    [setValue],
  );

  const onClearVehicle = useCallback(
    (saveVehicle: boolean) => {
      setValue("permitData.vehicleDetails", {
        ...EMPTY_VEHICLE_DETAILS,
        saveVehicle,
      });
    },
    [setValue],
  );

  const handleSave = () => {
    const powerUnit = serializePermitVehicleDetails(selectedVehicle);
    onSavePowerUnit(powerUnit);
  };

  return (
    <Dialog
      className="power-unit-dialog"
      open={open}
      onClose={onCancel}
      classes={{
        paper: "power-unit-dialog__container",
      }}
    >
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogTitle
            component="div"
            className="power-unit-dialog__header"
          >
            <div className="power-unit-dialog__icon">
              <FontAwesomeIcon className="icon" icon={faPlus} />
            </div>

            <span className="power-unit-dialog__title">
              {vehicleFormData.vin ? "Edit" : "Add"} Power Unit
            </span>
          </DialogTitle>

          <DialogContent className="power-unit-dialog__body">
            <VehicleDetails
              feature={feature}
              vehicleFormData={selectedVehicle}
              vehicleOptions={vehicleOptions}
              subtypeOptions={subtypeOptions}
              isLOAUsed={isLOAUsed}
              isSelectedLOAVehicle={isSelectedLOAVehicle}
              permitType={permitType}
              onSetSaveVehicle={onToggleSaveVehicle}
              onSetVehicle={onSetVehicle}
              onClearVehicle={onClearVehicle}
            />
          </DialogContent>

          <DialogActions className="power-unit-dialog__btns">
            <Button
              key="cancel-button"
              aria-label="Cancel"
              variant="contained"
              color="tertiary"
              className="power-unit-dialog__btn power-unit-dialog__btn--cancel"
              onClick={onCancel}
              data-testid="cancel-button"
            >
              Cancel
            </Button>

            <Button
              key="power-unit-button"
              aria-label="Done"
              type="submit"
              className="power-unit-dialog__btn power-unit-dialog__btn--done"
              data-testid="save-power-unit-button"
            >
              Done
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};
