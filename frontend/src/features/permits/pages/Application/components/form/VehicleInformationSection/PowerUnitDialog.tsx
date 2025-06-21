import { useCallback, useMemo } from "react";
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
  PowerUnit,
  Vehicle,
  VEHICLE_TYPES,
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
  // vehicle data as part of the permit form, not the form in this dialog
  vehicleFormData: PermitVehicleDetails;
  vehicleOptions: Vehicle[];
  subtypeOptions: VehicleSubType[];
  isLOAUsed: boolean;
  isSelectedLOAVehicle: boolean;
  permitType: PermitType;
  onCancel: () => void;
  onSavePowerUnit: (powerUnit: PermitVehicleDetails) => void;
}) => {
  // Flag indicating whether this dialog is opened to add power unit or edit power unit
  // The presence of vin existing in the vehicleFormData indicates whether the power unit
  // should be edited (or to be added if it's absent)
  const isEditMode = Boolean(vehicleFormData.vin);
  const prevSelectedSubtype = vehicleFormData.vehicleSubType;

  // If editing an existing power unit, only the previously selected power unit subtype can
  // be selected, and only vehicles of that subtype are available to be selected
  const powerUnitSubtypeOptions = useMemo(() => {
    return isEditMode
      ? subtypeOptions.filter(({ typeCode }) => typeCode === prevSelectedSubtype)
      : subtypeOptions;
  }, [isEditMode, subtypeOptions, prevSelectedSubtype]);

  const allowedVehicleOptions = useMemo(() => {
    return isEditMode
      ? vehicleOptions.filter(
        v => v.vehicleType === VEHICLE_TYPES.POWER_UNIT
          && (v as PowerUnit).powerUnitTypeCode === prevSelectedSubtype
      )
      : vehicleOptions;
  }, [isEditMode, vehicleOptions, prevSelectedSubtype]);

  // A secondary form is used to hold temporary power unit details inside this dialog
  // These temporary details will be saved to the permit form upon submit
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
        vehicleSubType: isEditMode
          ? prevSelectedSubtype
          : vehicleDetails.vehicleSubType,
      });
    },
    [setValue, prevSelectedSubtype, isEditMode],
  );

  const onClearVehicle = useCallback(
    (saveVehicle: boolean) => {
      setValue("permitData.vehicleDetails", {
        ...EMPTY_VEHICLE_DETAILS,
        vehicleSubType: isEditMode
          ? prevSelectedSubtype
          : EMPTY_VEHICLE_DETAILS.vehicleSubType,
        saveVehicle,
      });
    },
    [setValue, prevSelectedSubtype, isEditMode],
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
              {isEditMode ? "Edit" : "Add"} Power Unit
            </span>
          </DialogTitle>

          <DialogContent className="power-unit-dialog__body">
            <VehicleDetails
              feature={feature}
              vehicleFormData={selectedVehicle}
              vehicleOptions={allowedVehicleOptions}
              subtypeOptions={powerUnitSubtypeOptions}
              isLOAUsed={isLOAUsed}
              isSelectedLOAVehicle={isSelectedLOAVehicle}
              permitType={permitType}
              onSetSaveVehicle={onToggleSaveVehicle}
              onSetVehicle={onSetVehicle}
              onClearVehicle={onClearVehicle}
              disableSubtypeSelection={isEditMode}
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
