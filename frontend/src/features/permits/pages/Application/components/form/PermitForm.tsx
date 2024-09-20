import { Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useFormContext } from "react-hook-form";
import { useEffect, useMemo } from "react";

import "./PermitForm.scss";
import { FormActions } from "./FormActions";
import { ApplicationDetails } from "../../../../components/form/ApplicationDetails";
import { ContactDetails } from "../../../../components/form/ContactDetails";
import { PermitDetails } from "./PermitDetails";
import { VehicleDetails } from "./VehicleDetails/VehicleDetails";
import { CompanyProfile } from "../../../../../manageProfile/types/manageProfile.d";
import { Nullable } from "../../../../../../common/types/common";
import { EMPTY_VEHICLE_DETAILS, PermitVehicleDetails } from "../../../../types/PermitVehicleDetails";
import { PastStartDateStatus } from "../../../../../../common/components/form/subFormComponents/CustomDatePicker";
import { PermitLOA } from "./PermitLOA";
import { LOADetail } from "../../../../../settings/types/SpecialAuthorization";
import { isVehicleSubtypeLCV } from "../../../../../manageVehicles/helpers/vehicleSubtypes";
import { PermitCondition } from "../../../../types/PermitCondition";
import { LCV_CONDITION } from "../../../../constants/constants";
import { sortConditions } from "../../../../helpers/conditions";
import { getEndOfDate, getStartOfDate } from "../../../../../../common/helpers/formatDate";
import { getExpiryDate } from "../../../../helpers/permitState";
import { minDurationForPermitType } from "../../../../helpers/dateSelection";
import {
  PowerUnit,
  Trailer,
  VEHICLE_TYPES,
  VehicleSubType,
} from "../../../../../manageVehicles/types/Vehicle";

import {
  filterVehicles,
  getIneligiblePowerUnitSubtypes,
  getIneligibleTrailerSubtypes,
} from "../../../../helpers/permitVehicles";

interface PermitFormProps {
  feature: string;
  onLeave?: () => void;
  onSave?: () => Promise<void>;
  onCancel?: () => void;
  onContinue: () => Promise<void>;
  isAmendAction: boolean;
  permitNumber?: Nullable<string>;
  createdDateTime?: Nullable<Dayjs>;
  updatedDateTime?: Nullable<Dayjs>;
  vehicleOptions: (PowerUnit | Trailer)[];
  powerUnitSubTypes: VehicleSubType[];
  trailerSubTypes: VehicleSubType[];
  children?: React.ReactNode;
  companyInfo?: Nullable<CompanyProfile>;
  durationOptions: {
    value: number;
    label: string;
  }[];
  doingBusinessAs?: Nullable<string>;
  pastStartDateStatus: PastStartDateStatus;
  companyLOAs: LOADetail[];
  isLcvDesignated: boolean;
}

export const PermitForm = (props: PermitFormProps) => {
  const { watch, setValue } = useFormContext();

  const permitType = watch("permitType");
  const applicationNumber = watch("applicationNumber");
  const permitStartDate = watch("permitData.startDate");
  const startDate = getStartOfDate(permitStartDate);
  const permitDuration = watch("permitData.permitDuration");
  const permitConditions = watch("permitData.commodities");
  const vehicleFormData: PermitVehicleDetails = watch("permitData.vehicleDetails");
  const currentSelectedLOAs: LOADetail[] = watch("permitData.loas");

  const handleSetConditions = (conditions: PermitCondition[]) => {
    setValue("permitData.commodities", [...conditions]);
  };

  const handleToggleSaveVehicle = (saveVehicle: boolean) => {
    setValue("permitData.vehicleDetails.saveVehicle", saveVehicle);
  };

  const handleSetVehicle = (vehicleDetails: PermitVehicleDetails) => {
    setValue("permitData.vehicleDetails", {
      ...vehicleDetails,
    });
  };

  const handleClearVehicle = (saveVehicle: boolean) => {
    setValue("permitData.vehicleDetails", {
      ...EMPTY_VEHICLE_DETAILS,
      saveVehicle,
    });
  };

  const handleSetDuration = (duration: number) => {
    setValue("permitData.permitDuration", duration);
  };

  const handleSetExpiryDate = (expiry: Dayjs) => {
    setValue("permitData.expiryDate", dayjs(expiry));
  };

  const getMostRecentExpiryFromLOAs = (loas: LOADetail[]) => {
    const expiringLOAs = loas.filter(loa => Boolean(loa.expiryDate));
    if (expiringLOAs.length === 0) return null;

    const firstLOAExpiryDate = getEndOfDate(dayjs(expiringLOAs[0].expiryDate));
    return expiringLOAs.map(loa => loa.expiryDate)
      .reduce((prevExpiry, currExpiry) => {
        const prevExpiryDate = getEndOfDate(dayjs(prevExpiry));
        const currExpiryDate = getEndOfDate(dayjs(currExpiry));
        return prevExpiryDate.isAfter(currExpiryDate) ? currExpiryDate : prevExpiryDate;
      }, firstLOAExpiryDate);
  };

  const handleUpdateLOAs = (updatedLOAs: LOADetail[]) => {
    setValue("permitData.loas", updatedLOAs);
  };

  // Limit permit duration options based on selected LOAs
  const providedDurationOptions = props.durationOptions;
  const durationOptions = useMemo(() => {
    const mostRecentLOAExpiry = getMostRecentExpiryFromLOAs(currentSelectedLOAs);
    if (!mostRecentLOAExpiry) return providedDurationOptions;

    return providedDurationOptions
      .filter(({ value: durationDays }) => mostRecentLOAExpiry.isAfter(getExpiryDate(startDate, durationDays)));
  }, [providedDurationOptions, currentSelectedLOAs, startDate]);

  useEffect(() => {
    // If duration options change, check if the current permit duration is still selectable
    const minAllowableDuration = minDurationForPermitType(permitType);
    const maxDurationInOptions = Math.max(...durationOptions.map(durationOption => durationOption.value));

    if (permitDuration > maxDurationInOptions) {
      if (maxDurationInOptions < minAllowableDuration) {
        handleSetDuration(minAllowableDuration);
      } else {
        handleSetDuration(maxDurationInOptions);
      }
    }
  }, [permitDuration, durationOptions, permitType]);

  const isLcvDesignated = props.isLcvDesignated;
  const ineligiblePowerUnitSubtypes = getIneligiblePowerUnitSubtypes(permitType)
    .filter(subtype => !isLcvDesignated || !isVehicleSubtypeLCV(subtype.typeCode));

  const ineligibleTrailerSubtypes = getIneligibleTrailerSubtypes(permitType);

  // Permit expiry date === Permit start date + Permit duration - 1
  const expiryDate = getExpiryDate(startDate, permitDuration);
  useEffect(() => {
    handleSetExpiryDate(expiryDate);
  }, [expiryDate]);
  
  const isAmendAction = props.isAmendAction;

  const vehicleSubtype = vehicleFormData.vehicleSubType;
  useEffect(() => {
    if (
      !isVehicleSubtypeLCV(vehicleSubtype)
      && permitConditions.some(({ condition }: PermitCondition) => condition === LCV_CONDITION.condition)
    ) {
      // If vehicle subtype in the form isn't LCV but conditions have LCV,
      // then remove that LCV condition from the form
    handleSetConditions(permitConditions.filter(
        ({ condition }: PermitCondition) => condition !== LCV_CONDITION.condition,
      ));
    } else if (
      isVehicleSubtypeLCV(vehicleSubtype)
      && !permitConditions.some(({ condition }: PermitCondition) => condition === LCV_CONDITION.condition)
    ) {
      // If vehicle subtype in the form is LCV but conditions don't have LCV,
      // then add that LCV condition into the form
      handleSetConditions(sortConditions([...permitConditions, LCV_CONDITION]));
    }
  }, [vehicleSubtype, permitConditions]);

  // Check to see if vehicle details is still valid after LOA has been deselected
  const vehicleOptions = props.vehicleOptions;
  const vehicleIdInForm = vehicleFormData.vehicleId;
  const vehicleType = vehicleFormData.vehicleType;
  const saveVehicle = Boolean(vehicleFormData.saveVehicle);
  useEffect(() => {
    const filteredVehicles = filterVehicles(
      vehicleOptions,
      ineligiblePowerUnitSubtypes,
      ineligibleTrailerSubtypes,
      currentSelectedLOAs,
    ).map(filteredVehicle => ({
      filteredVehicleType: filteredVehicle.vehicleType,
      filteredVehicleId: filteredVehicle.vehicleType === VEHICLE_TYPES.TRAILER
        ? (filteredVehicle as Trailer).trailerId
        : (filteredVehicle as PowerUnit).powerUnitId,
    }));

    // If vehicle selected is an existing vehicle but is not in list of vehicle options
    // Clear the vehicle details in the form
    if (vehicleIdInForm && !filteredVehicles.some(({
      filteredVehicleType,
      filteredVehicleId,
    }) => filteredVehicleType === vehicleType && filteredVehicleId === vehicleIdInForm)) {
      handleClearVehicle(saveVehicle);
    }
  }, [
    currentSelectedLOAs,
    vehicleOptions,
    ineligiblePowerUnitSubtypes,
    ineligibleTrailerSubtypes,
    vehicleIdInForm,
    vehicleType,
    saveVehicle,
  ]);
  
  return (
    <Box className="permit-form layout-box">
      <Box className="permit-form__form">
        <ApplicationDetails
          permitType={permitType}
          infoNumber={
            isAmendAction ? props.permitNumber : applicationNumber
          }
          infoNumberType={isAmendAction ? "permit" : "application"}
          createdDateTime={props.createdDateTime}
          updatedDateTime={props.updatedDateTime}
          companyInfo={props.companyInfo}
          isAmendAction={isAmendAction}
          doingBusinessAs={props.doingBusinessAs}
        />

        <ContactDetails feature={props.feature} />

        <PermitLOA
          permitType={permitType}
          startDate={startDate}
          isPermitIssued={isAmendAction}
          selectedLOAs={currentSelectedLOAs}
          companyLOAs={props.companyLOAs}
          onUpdateLOAs={handleUpdateLOAs}
        />

        <PermitDetails
          feature={props.feature}
          expiryDate={expiryDate}
          conditionsInPermit={permitConditions}
          durationOptions={durationOptions}
          disableStartDate={isAmendAction}
          permitType={permitType}
          pastStartDateStatus={props.pastStartDateStatus}
          includeLcvCondition={isLcvDesignated && isVehicleSubtypeLCV(vehicleFormData.vehicleSubType)}
          onSetConditions={handleSetConditions}
        />
        
        <VehicleDetails
          feature={props.feature}
          vehicleFormData={vehicleFormData}
          vehicleOptions={props.vehicleOptions}
          powerUnitSubtypes={props.powerUnitSubTypes}
          trailerSubtypes={props.trailerSubTypes}
          ineligiblePowerUnitSubtypes={ineligiblePowerUnitSubtypes}
          ineligibleTrailerSubtypes={ineligibleTrailerSubtypes}
          selectedLOAs={currentSelectedLOAs}
          onSetSaveVehicle={handleToggleSaveVehicle}
          onSetVehicle={handleSetVehicle}
          onClearVehicle={handleClearVehicle}
        />
        {props.children}
      </Box>

      <FormActions
        onLeave={props.onLeave}
        onSave={props.onSave}
        onCancel={props.onCancel}
        onContinue={props.onContinue}
      />
    </Box>
  );
};
