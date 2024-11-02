import dayjs, { Dayjs } from "dayjs";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";

import { PermitCondition } from "../../types/PermitCondition";
import { PermitLOA } from "../../types/PermitLOA";
import { VehicleInConfiguration } from "../../types/PermitVehicleConfiguration";
import { EMPTY_VEHICLE_DETAILS, PermitVehicleDetails } from "../../types/PermitVehicleDetails";
import { ApplicationFormData } from "../../types/application";

export const useChangeApplicationFormValues = () => {
  const { setValue } = useFormContext<ApplicationFormData>();

  const onSetDuration = useCallback((duration: number) => {
    setValue("permitData.permitDuration", duration);
  }, [setValue]);

  const onSetExpiryDate = useCallback((expiry: Dayjs) => {
    setValue("permitData.expiryDate", dayjs(expiry));
  }, [setValue]);

  const onSetConditions = useCallback((conditions: PermitCondition[]) => {
    setValue("permitData.commodities", [...conditions]);
  }, [setValue]);

  const onToggleSaveVehicle = useCallback((saveVehicle: boolean) => {
    setValue("permitData.vehicleDetails.saveVehicle", saveVehicle);
  }, [setValue]);

  const onSetVehicle = useCallback((vehicleDetails: PermitVehicleDetails) => {
    setValue("permitData.vehicleDetails", {
      ...vehicleDetails,
    });
  }, [setValue]);

  const onClearVehicle = useCallback((saveVehicle: boolean) => {
    setValue("permitData.vehicleDetails", {
      ...EMPTY_VEHICLE_DETAILS,
      saveVehicle,
    });
  }, [setValue]);

  const onUpdateLOAs = useCallback((updatedLOAs: PermitLOA[]) => {
    setValue("permitData.loas", updatedLOAs);
  }, [setValue]);

  const onUpdateHighwaySequence = useCallback((updatedHighwaySequence: string[]) => {
    setValue(
      "permitData.permittedRoute.manualRoute.highwaySequence",
      updatedHighwaySequence,
    );
  }, [setValue]);

  const onUpdateVehicleConfigTrailers = useCallback(
    (updatedTrailerSubtypes: VehicleInConfiguration[]) => {
      setValue(
        "permitData.vehicleConfiguration.trailers",
        updatedTrailerSubtypes,
      );
    },
    [setValue],
  );

  return {
    onSetDuration,
    onSetExpiryDate,
    onSetConditions,
    onToggleSaveVehicle,
    onSetVehicle,
    onClearVehicle,
    onUpdateLOAs,
    onUpdateHighwaySequence,
    onUpdateVehicleConfigTrailers,
  };
};
