import dayjs, { Dayjs } from "dayjs";
import { useCallback } from "react";
import { useFormContext } from "react-hook-form";

import { PermitCondition } from "../../types/PermitCondition";
import { PermitLOA } from "../../types/PermitLOA";
import { PermitVehicleConfiguration, VehicleInConfiguration } from "../../types/PermitVehicleConfiguration";
import { EMPTY_VEHICLE_DETAILS, PermitVehicleDetails } from "../../types/PermitVehicleDetails";
import { ApplicationFormData } from "../../types/application";
import { getDefaultVehicleConfiguration } from "../../helpers/vehicles/configuration/getDefaultVehicleConfiguration";
import { PermitType } from "../../types/PermitType";
import { Nullable, RequiredOrNull } from "../../../../common/types/common";
import { ThirdPartyLiability } from "../../types/ThirdPartyLiability";
import { VehicleType } from "../../../manageVehicles/types/Vehicle";
import { ConditionalLicensingFeeType } from "../../types/ConditionalLicensingFee";

/**
 * Hook that returns custom methods that update specific values in the application form.
 * This allows a degree of control over encapsulation of the form methods (eg. without leaking/allowing form methods
 * like setValue to be called directly everywhere throughout the child components).
 * 
 * NOTE: This hook must be used inside a component/hook that is a child of an application FormProvider.
 * @returns Custom methods to update specific values in the application form
 */
export const useApplicationFormUpdateMethods = () => {
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

  const onSetVin = useCallback((vin: string) => {
    setValue("permitData.vehicleDetails.vin", vin);
  }, [setValue]);

  const onSetPlate = useCallback((plate: string) => {
    setValue("permitData.vehicleDetails.plate", plate);
  }, [setValue]);

  const onSetMake = useCallback((make: string) => {
    setValue("permitData.vehicleDetails.make", make);
  }, [setValue]);

  const onSetYear = useCallback((year: Nullable<number>) => {
    setValue("permitData.vehicleDetails.year", year);
  }, [setValue]);
  
  const onSetCountryCode = useCallback((countryCode: string) => {
    setValue("permitData.vehicleDetails.countryCode", countryCode);
  }, [setValue]);
  
  const onSetProvinceCode = useCallback((provinceCode: string) => {
    setValue("permitData.vehicleDetails.provinceCode", provinceCode);
  }, [setValue]);
  
  const onSetVehicleType = useCallback((vehicleType: string) => {
    setValue("permitData.vehicleDetails.vehicleType", vehicleType);
  }, [setValue]);
  
  const onSetVehicleSubtype = useCallback((vehicleSubtype: string) => {
    setValue("permitData.vehicleDetails.vehicleSubType", vehicleSubtype);
  }, [setValue]);
  
  const onSetUnitNumber = useCallback((unitNumber: Nullable<string>) => {
    setValue("permitData.vehicleDetails.unitNumber", unitNumber);
  }, [setValue]);

  const onSetVehicleId = useCallback((vehicleId: Nullable<string>) => {
    setValue("permitData.vehicleDetails.vehicleId", vehicleId);
  }, [setValue]);

  const onSetLicensedGVW = useCallback((licensedGVW?: Nullable<number>) => {
    setValue("permitData.vehicleDetails.licensedGVW", licensedGVW);
  }, [setValue]);

  const onSetVehicle = useCallback((vehicleDetails: PermitVehicleDetails) => {
    setValue("permitData.vehicleDetails", {
      ...vehicleDetails,
    });
  }, [setValue]);

  const onClearVehicle = useCallback((
    saveVehicle: boolean,
    defaultTypes?: Nullable<{
      vehicleType: VehicleType;
      vehicleSubtype: string;
    }>,
  ) => {
    setValue("permitData.vehicleDetails", {
      ...EMPTY_VEHICLE_DETAILS,
      vehicleType: defaultTypes ? defaultTypes.vehicleType : EMPTY_VEHICLE_DETAILS.vehicleType,
      vehicleSubType: defaultTypes ? defaultTypes.vehicleSubtype : EMPTY_VEHICLE_DETAILS.vehicleSubType,
      saveVehicle,
    });
  }, [setValue]);

  const onSetCommodityType = useCallback((commodityType: string) => {
    setValue("permitData.permittedCommodity.commodityType", commodityType);
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

  const onUpdateTripOrigin = useCallback((updatedTripOrigin: string) => {
    setValue(
      "permitData.permittedRoute.manualRoute.origin",
      updatedTripOrigin,
    );
  }, [setValue]);

  const onUpdateTripDestination = useCallback((updatedTripDestination: string) => {
    setValue(
      "permitData.permittedRoute.manualRoute.destination",
      updatedTripDestination,
    );
  }, [setValue]);

  const onUpdateTotalDistance = useCallback((updatedTotalDistance?: RequiredOrNull<number>) => {
    setValue(
      "permitData.permittedRoute.manualRoute.totalDistance",
      updatedTotalDistance,
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

  const onUpdateVehicleConfig = useCallback(
    (updatedVehicleConfig: RequiredOrNull<PermitVehicleConfiguration>) => {
      setValue(
        "permitData.vehicleConfiguration",
        updatedVehicleConfig,
      );
    },
    [setValue],
  );

  const onClearVehicleConfig = useCallback(
    (permitType: PermitType) => {
      setValue(
        "permitData.vehicleConfiguration",
        getDefaultVehicleConfiguration(permitType),
      );
    },
    [setValue],
  );

  const onUpdateThirdPartyLiability = useCallback(
    (updatedThirdPartyLiability: ThirdPartyLiability) => {
      setValue(
        "permitData.thirdPartyLiability",
        updatedThirdPartyLiability,
      );
    },
    [setValue],
  );

  const onUpdateConditionalLicensingFee = useCallback(
    (updatedConditionalLicensingFee: ConditionalLicensingFeeType) => {
      setValue(
        "permitData.conditionalLicensingFee",
        updatedConditionalLicensingFee,
      );
    },
    [setValue],
  );

  const onUpdateLoadedGVW = useCallback(
    (updatedLoadedGVW: RequiredOrNull<number>) => {
      setValue(
        "permitData.vehicleConfiguration.loadedGVW",
        updatedLoadedGVW,
      );
    },
    [setValue],
  );

  const onUpdateNetWeight = useCallback(
    (updatedNetWeight: RequiredOrNull<number>) => {
      setValue(
        "permitData.vehicleConfiguration.netWeight",
        updatedNetWeight,
      );
    },
    [setValue],
  );

  return {
    onSetDuration,
    onSetExpiryDate,
    onSetConditions,
    onToggleSaveVehicle,
    onSetVin,
    onSetPlate,
    onSetMake,
    onSetYear,
    onSetCountryCode,
    onSetProvinceCode,
    onSetVehicleType,
    onSetVehicleSubtype,
    onSetUnitNumber,
    onSetVehicleId,
    onSetLicensedGVW,
    onSetVehicle,
    onClearVehicle,
    onUpdateLOAs,
    onUpdateHighwaySequence,
    onUpdateTripOrigin,
    onUpdateTripDestination,
    onUpdateTotalDistance,
    onUpdateVehicleConfigTrailers,
    onSetCommodityType,
    onUpdateVehicleConfig,
    onClearVehicleConfig,
    onUpdateThirdPartyLiability,
    onUpdateConditionalLicensingFee,
    onUpdateLoadedGVW,
    onUpdateNetWeight,
  };
};
