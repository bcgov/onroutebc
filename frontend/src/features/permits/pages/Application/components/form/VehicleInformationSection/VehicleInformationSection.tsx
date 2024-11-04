import { useState } from "react";
import { Box, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import "./VehicleInformationSection.scss";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { InfoBcGovBanner } from "../../../../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../../../../common/constants/bannerMessages";
import { PermitVehicleDetails } from "../../../../../types/PermitVehicleDetails";
import { Vehicle, VehicleSubType } from "../../../../../../manageVehicles/types/Vehicle";
import { VehicleDetails } from "./VehicleDetails";
import { PowerUnitInfo } from "./PowerUnitInfo";
import { AddPowerUnitDialog } from "./AddPowerUnitDialog";
import { AddTrailer } from "./AddTrailer";
import { VehicleInConfiguration } from "../../../../../types/PermitVehicleConfiguration";

export const VehicleInformationSection = ({
  permitType,
  feature,
  vehicleFormData,
  vehicleOptions,
  subtypeOptions,
  isSelectedLOAVehicle,
  nextAllowedSubtypes,
  trailerSubtypeNamesMap,
  selectedConfigSubtypes,
  onSetSaveVehicle,
  onSetVehicle,
  onClearVehicle,
  onUpdateVehicleConfigTrailers,
}: {
  permitType: PermitType;
  feature: string;
  vehicleFormData: PermitVehicleDetails;
  vehicleOptions: Vehicle[];
  subtypeOptions: VehicleSubType[];
  isSelectedLOAVehicle: boolean;
  nextAllowedSubtypes: {
    value: string;
    label: string;
  }[];
  trailerSubtypeNamesMap: Map<string, string>;
  selectedConfigSubtypes: string[];
  onSetSaveVehicle: (saveVehicle: boolean) => void;
  onSetVehicle: (vehicleDetails: PermitVehicleDetails) => void;
  onClearVehicle: (saveVehicle: boolean) => void;
  onUpdateVehicleConfigTrailers: (updatedTrailerSubtypes: VehicleInConfiguration[]) => void;
}) => {
  const isSingleTrip = permitType === PERMIT_TYPES.STOS;
  const infoSectionClassName = `vehicle-information-section__info`
    + `${isSingleTrip ? " vehicle-information-section__info--single-trip" : ""}`;

  const infoBannerClassName = `vehicle-information-section__info-banner`
    + `${isSingleTrip ? " vehicle-information-section__info-banner--single-trip" : ""}`;

  const isPowerUnitSelectedForSingleTrip = isSingleTrip && Boolean(vehicleFormData.vin);

  const [showAddPowerUnitDialog, setShowAddPowerUnitDialog] = useState<boolean>(false);

  const handleClickAddPowerUnit = () => {
    if (isPowerUnitSelectedForSingleTrip) return;
    setShowAddPowerUnitDialog(true);
  };

  const handleClosePowerUnitDialog = () => {
    onClearVehicle(false);
    onUpdateVehicleConfigTrailers([]);
    setShowAddPowerUnitDialog(false);
  };

  const handleAddPowerUnit = () => {
    // Only thing the "Add" button does on the dialog is to close the dialog
    // This is because the actually creation/update of the power unit is done by the application form
    // when the "Save/Continue" button is clicked.
    // Also, changing any of the inputs inside the dialog updates the values for the vehicleDetails
    // inside the application form data
    setShowAddPowerUnitDialog(false);
  };

  const handleRemovePowerUnit = () => {
    onClearVehicle(false);
    onUpdateVehicleConfigTrailers([]);
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
            <Button
              classes={{
                root: "add-power-unit-btn",
                disabled: "add-power-unit-btn--disabled",
              }}
              key="add-power-unit-button"
              aria-label="Add Power Unit"
              variant="contained"
              color="tertiary"
              disabled={isPowerUnitSelectedForSingleTrip}
              onClick={handleClickAddPowerUnit}
            >
              <FontAwesomeIcon className="add-power-unit-btn__icon" icon={faPlus} />
              Add Power Unit
            </Button>
          ) : (
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
          )}
        </div>

        <PowerUnitInfo
          showPowerUnitInfo={isPowerUnitSelectedForSingleTrip}
          powerUnitInfo={vehicleFormData}
          onRemovePowerUnit={handleRemovePowerUnit}
        />

        {isPowerUnitSelectedForSingleTrip ? (
          <AddTrailer
            selectedTrailerSubtypes={selectedConfigSubtypes}
            trailerSubtypeOptions={nextAllowedSubtypes}
            trailerSubtypeNamesMap={trailerSubtypeNamesMap}
            onUpdateVehicleConfigTrailers={onUpdateVehicleConfigTrailers}
          />
        ) : null}
      </Box>

      {showAddPowerUnitDialog ? (
        <AddPowerUnitDialog
          open={showAddPowerUnitDialog}
          feature={feature}
          vehicleFormData={vehicleFormData}
          vehicleOptions={vehicleOptions}
          subtypeOptions={subtypeOptions}
          isSelectedLOAVehicle={isSelectedLOAVehicle}
          permitType={permitType}
          onSetSaveVehicle={onSetSaveVehicle}
          onSetVehicle={onSetVehicle}
          onClearVehicle={onClearVehicle}
          onCancel={handleClosePowerUnitDialog}
          onClickAdd={handleAddPowerUnit}
        />
      ) : null}
    </Box>
  );
};

