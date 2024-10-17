import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";

import { Nullable } from "../../../../../common/types/common";
import { Permit } from "../../../types/permit";
import { Application } from "../../../types/application";
import { applyWhenNotNullable } from "../../../../../common/helpers/util";
import { CompanyProfile } from "../../../../manageProfile/types/manageProfile";
import { applyLCVToApplicationData } from "../../../helpers/permitLCV";
import { PermitCondition } from "../../../types/PermitCondition";
import { EMPTY_VEHICLE_DETAILS, PermitVehicleDetails } from "../../../types/PermitVehicleDetails";
import { LOADetail } from "../../../../settings/types/LOADetail";
import { getIneligibleSubtypes } from "../../../helpers/permitVehicles";
import { applyUpToDateLOAsToApplication } from "../../../helpers/permitLOA";
import { PowerUnit, Trailer } from "../../../../manageVehicles/types/Vehicle";
import { PermitLOA } from "../../../types/PermitLOA";
import {
  AmendPermitFormData,
  getDefaultFormDataFromApplication,
  getDefaultFormDataFromPermit,
} from "../types/AmendPermitFormData";

export const useAmendPermitForm = (
  repopulateFormData: boolean,
  isLcvDesignated: boolean,
  companyLOAs: LOADetail[],
  inventoryVehicles: (PowerUnit | Trailer)[],
  companyInfo: Nullable<CompanyProfile>,
  permit?: Nullable<Permit>,
  amendmentApplication?: Nullable<Application>,
) => {
  // Default form data values to populate the amend form with
  const defaultFormData = useMemo(() => {
    if (amendmentApplication) {
      const ineligibleSubtypes = getIneligibleSubtypes(
        amendmentApplication.permitType,
        isLcvDesignated,
      );

      const ineligiblePowerUnitSubtypes= ineligibleSubtypes.ineligiblePowerUnitSubtypes
        .map(({ typeCode }) => typeCode);
      
      const ineligibleTrailerSubtypes = ineligibleSubtypes.ineligibleTrailerSubtypes
        .map(({ typeCode }) => typeCode);

      return applyUpToDateLOAsToApplication(
        applyLCVToApplicationData(
          getDefaultFormDataFromApplication(
            companyInfo,
            amendmentApplication,
          ),
          isLcvDesignated,
        ),
        companyLOAs,
        inventoryVehicles,
        ineligiblePowerUnitSubtypes,
        ineligibleTrailerSubtypes,
      );
    }

    // Permit doesn't have existing amendment application
    // Populate form data with permit, with initial empty comment
    const defaultPermitFormData = getDefaultFormDataFromPermit(
      companyInfo,
      applyWhenNotNullable(
        (p) => ({
          ...p,
          comment: "",
        }),
        permit,
      ),
    );

    const ineligibleSubtypes = getIneligibleSubtypes(
      defaultPermitFormData.permitType,
      isLcvDesignated,
    );

    const ineligiblePowerUnitSubtypes= ineligibleSubtypes.ineligiblePowerUnitSubtypes
      .map(({ typeCode }) => typeCode);
    
    const ineligibleTrailerSubtypes = ineligibleSubtypes.ineligibleTrailerSubtypes
      .map(({ typeCode }) => typeCode);
    
    return applyUpToDateLOAsToApplication(
      applyLCVToApplicationData(
        defaultPermitFormData,
        isLcvDesignated,
      ),
      companyLOAs,
      inventoryVehicles,
      ineligiblePowerUnitSubtypes,
      ineligibleTrailerSubtypes,
    );
  }, [
    amendmentApplication,
    permit,
    repopulateFormData,
    companyInfo,
    isLcvDesignated,
    companyLOAs,
    inventoryVehicles,
  ]);

  // Register default values with react-hook-form
  const formMethods = useForm<AmendPermitFormData>({
    defaultValues: defaultFormData,
    reValidateMode: "onBlur",
  });

  const { reset, watch, setValue } = formMethods;
  const formData = watch();

  useEffect(() => {
    reset(defaultFormData);
  }, [defaultFormData]);

  const onSetDuration = (duration: number) => {
    setValue("permitData.permitDuration", duration);
  };

  const onSetExpiryDate = (expiry: Dayjs) => {
    setValue("permitData.expiryDate", dayjs(expiry));
  };

  const onSetConditions = (conditions: PermitCondition[]) => {
    setValue("permitData.commodities", [...conditions]);
  };

  const onToggleSaveVehicle = (saveVehicle: boolean) => {
    setValue("permitData.vehicleDetails.saveVehicle", saveVehicle);
  };

  const onSetVehicle = (vehicleDetails: PermitVehicleDetails) => {
    setValue("permitData.vehicleDetails", {
      ...vehicleDetails,
    });
  };

  const onClearVehicle = (saveVehicle: boolean) => {
    setValue("permitData.vehicleDetails", {
      ...EMPTY_VEHICLE_DETAILS,
      saveVehicle,
    });
  };

  const onUpdateLOAs = (updatedLOAs: PermitLOA[]) => {
    setValue("permitData.loas", updatedLOAs);
  };

  return {
    initialFormData: defaultFormData,
    formData,
    formMethods,
    onSetDuration,
    onSetExpiryDate,
    onSetConditions,
    onToggleSaveVehicle,
    onSetVehicle,
    onClearVehicle,
    onUpdateLOAs,
  };
};
