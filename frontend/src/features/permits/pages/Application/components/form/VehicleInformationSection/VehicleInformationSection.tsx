import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Box, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import "./VehicleInformationSection.scss";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { InfoBcGovBanner } from "../../../../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../../../../common/constants/bannerMessages";
import { PermitVehicleDetails } from "../../../../../types/PermitVehicleDetails";
import {
  Vehicle,
  VehicleSubType,
} from "../../../../../../manageVehicles/types/Vehicle";
import { VehicleDetails } from "./VehicleDetails";
import { PowerUnitInfo } from "./PowerUnitInfo";
import { PowerUnitDialog } from "./PowerUnitDialog";
import { AddTrailer } from "./AddTrailer";
import {
  PermitVehicleConfiguration,
  VehicleInConfiguration,
} from "../../../../../types/PermitVehicleConfiguration";
import { requiredPowerUnit } from "../../../../../../../common/helpers/validationMessages";
import { ApplicationFormData } from "../../../../../types/application";
import {
  Nullable,
  ORBCFormFeatureType,
} from "../../../../../../../common/types/common";
import { DEFAULT_EMPTY_SELECT_VALUE } from "../../../../../../../common/constants/constants";
import { RemovePowerUnitDialog } from "./RemovePowerUnitDialog";

export const VehicleInformationSection = ({
  permitType,
  feature,
  vehicleFormData,
  vehicleOptions,
  subtypeOptions,
  isLOAUsed,
  isSelectedLOAVehicle,
  nextAllowedSubtypes,
  powerUnitSubtypeNamesMap,
  trailerSubtypeNamesMap,
  selectedTrailers,
  selectedCommodityType,
  onSetSaveVehicle,
  onSetVehicle,
  onClearVehicle,
  onUpdateVehicleConfigTrailers,
  onUpdateVehicleConfig,
  onClearVehicleConfig,
}: {
  permitType: PermitType;
  feature: ORBCFormFeatureType;
  vehicleFormData: PermitVehicleDetails;
  vehicleOptions: Vehicle[];
  subtypeOptions: VehicleSubType[];
  isLOAUsed: boolean;
  isSelectedLOAVehicle: boolean;
  nextAllowedSubtypes: {
    value: string;
    label: string;
  }[];
  powerUnitSubtypeNamesMap: Map<string, string>;
  trailerSubtypeNamesMap: Map<string, string>;
  selectedTrailers: VehicleInConfiguration[];
  selectedCommodityType?: Nullable<string>;
  onSetSaveVehicle: (saveVehicle: boolean) => void;
  onSetVehicle: (vehicleDetails: PermitVehicleDetails) => void;
  onClearVehicle: (saveVehicle: boolean) => void;
  onUpdateVehicleConfigTrailers: (
    updatedTrailerSubtypes: VehicleInConfiguration[],
  ) => void;
  onUpdateVehicleConfig: (vehicleConfig: PermitVehicleConfiguration) => void;
  onClearVehicleConfig: (permitType: PermitType) => void;
}) => {
  const isSingleTrip =
    permitType === PERMIT_TYPES.STOS || permitType === PERMIT_TYPES.STOW;
  const infoSectionClassName =
    `vehicle-information-section__info` +
    `${isSingleTrip ? " vehicle-information-section__info--single-trip" : ""}`;

  const infoBannerClassName =
    `vehicle-information-section__info-banner` +
    `${isSingleTrip ? " vehicle-information-section__info-banner--single-trip" : ""}`;

  const isCommodityTypeSelected =
    Boolean(selectedCommodityType) &&
    selectedCommodityType !== DEFAULT_EMPTY_SELECT_VALUE;

  const isPowerUnitSelectedForSingleTrip =
    isSingleTrip && Boolean(vehicleFormData.vin);

  const [showPowerUnitDialog, setShowPowerUnitDialog] =
    useState<boolean>(false);

  const [showRemovePowerUnitDialog, setShowRemovePowerUnitDialog] =
    useState<boolean>(false);

  const powerUnitFieldRef = "permitData.vehicleDetails";
  const { clearErrors } = useFormContext<ApplicationFormData>();

  const handleClickAddPowerUnit = () => {
    if (isPowerUnitSelectedForSingleTrip || !isCommodityTypeSelected) return;
    setShowPowerUnitDialog(true);
  };

  const handleClickRemovePowerUnit = () => {
    if (permitType === PERMIT_TYPES.STOW) {
      // For STOW, we want to show a confirmation dialog before removing the power unit since the axle spacing and weights information will also be removed and this information is required for the application.
      setShowRemovePowerUnitDialog(true);
    } else {
      // For STOS, we can directly remove the power unit without confirmation since axle spacing and weights information is not required.
      handleRemovePowerUnit();
    }
  };

  const handleClickEditPowerUnit = () => {
    if (!isPowerUnitSelectedForSingleTrip || !isCommodityTypeSelected) return;
    setShowPowerUnitDialog(true);
  };

  const handleRemovePowerUnit = () => {
    onClearVehicle(false);
    onUpdateVehicleConfigTrailers([]);
    onUpdateVehicleConfig({});
    if (permitType === PERMIT_TYPES.STOW) {
      // For STOW, we also need to clear the axle configuration when the power unit is removed
      onClearVehicleConfig(permitType);
      setShowRemovePowerUnitDialog(false);
    }
  };

  const handleClosePowerUnitDialog = () => {
    setShowPowerUnitDialog(false);
  };

  const handleSavePowerUnit = (powerUnit: PermitVehicleDetails) => {
    clearErrors(powerUnitFieldRef);
    onSetVehicle(powerUnit);
    setShowPowerUnitDialog(false);
  };

  return (
    <Box className="vehicle-information-section">
      <Box className="vehicle-information-section__header">
        <h3>Vehicle Information</h3>
      </Box>

      <Box className="vehicle-information-section__body">
        <h4>
          Choose a saved vehicle from your inventory or enter new vehicle
          information below.
        </h4>

        <div className={infoSectionClassName}>
          <InfoBcGovBanner
            className={infoBannerClassName}
            msg={BANNER_MESSAGES.CANNOT_FIND_VEHICLE.TITLE}
            additionalInfo={
              <div className="vehicle-inventory-info">
                {BANNER_MESSAGES.CANNOT_FIND_VEHICLE.DETAIL}
                <br />
                <br />
                {BANNER_MESSAGES.CANNOT_FIND_VEHICLE.INELIGIBLE_SUBTYPES}
              </div>
            }
          />

          {isSingleTrip ? (
            <Controller
              name={powerUnitFieldRef}
              rules={{
                validate: (v) => v.vin.trim() !== "" || requiredPowerUnit(),
              }}
              render={({ fieldState: { error } }) => (
                <div className="add-power-unit">
                  <Button
                    classes={{
                      root: "add-power-unit-btn",
                      disabled: "add-power-unit-btn--disabled",
                    }}
                    key="add-power-unit-button"
                    aria-label="Add Power Unit"
                    variant="contained"
                    color="tertiary"
                    disabled={
                      isPowerUnitSelectedForSingleTrip ||
                      !isCommodityTypeSelected
                    }
                    onClick={handleClickAddPowerUnit}
                  >
                    <FontAwesomeIcon
                      className="add-power-unit-btn__icon"
                      icon={faPlus}
                    />
                    Add Power Unit
                  </Button>

                  {error?.message ? (
                    <p className="add-power-unit__error">{error.message}</p>
                  ) : null}
                </div>
              )}
            />
          ) : (
            <VehicleDetails
              feature={feature}
              vehicleFormData={vehicleFormData}
              vehicleOptions={vehicleOptions}
              subtypeOptions={subtypeOptions}
              isLOAUsed={isLOAUsed}
              isSelectedLOAVehicle={isSelectedLOAVehicle}
              permitType={permitType}
              onSetSaveVehicle={onSetSaveVehicle}
              onSetVehicle={onSetVehicle}
              onClearVehicle={onClearVehicle}
            />
          )}
        </div>

        {isPowerUnitSelectedForSingleTrip ? (
          <PowerUnitInfo
            powerUnitInfo={vehicleFormData}
            powerUnitSubtypeNamesMap={powerUnitSubtypeNamesMap}
            onRemovePowerUnit={handleClickRemovePowerUnit}
            onEditPowerUnit={handleClickEditPowerUnit}
          />
        ) : null}

        {isPowerUnitSelectedForSingleTrip ? (
          <AddTrailer
            selectedTrailers={selectedTrailers}
            trailerSubtypeOptions={nextAllowedSubtypes}
            trailerSubtypeNamesMap={trailerSubtypeNamesMap}
            onUpdateVehicleConfigTrailers={onUpdateVehicleConfigTrailers}
            permitType={permitType}
          />
        ) : null}
      </Box>

      {showPowerUnitDialog ? (
        <PowerUnitDialog
          open={showPowerUnitDialog}
          feature={feature}
          vehicleFormData={vehicleFormData}
          vehicleOptions={vehicleOptions}
          subtypeOptions={subtypeOptions}
          isLOAUsed={isLOAUsed}
          isSelectedLOAVehicle={isSelectedLOAVehicle}
          permitType={permitType}
          onCancel={handleClosePowerUnitDialog}
          onSavePowerUnit={handleSavePowerUnit}
        />
      ) : null}

      {showRemovePowerUnitDialog ? (
        <RemovePowerUnitDialog
          isOpen={showRemovePowerUnitDialog}
          onCancel={() => setShowRemovePowerUnitDialog(false)}
          onConfirm={handleRemovePowerUnit}
        />
      ) : null}
    </Box>
  );
};
