import { createContext } from "react";
import { Dayjs } from "dayjs";
import { Policy } from "onroute-policy-engine";

import { PermitVehicleDetails } from "../types/PermitVehicleDetails";
import { LOADetail } from "../../settings/types/LOADetail";
import { ApplicationFormData } from "../types/application";
import { getDefaultValues } from "../helpers/getDefaultApplicationFormData";
import { DEFAULT_PERMIT_TYPE } from "../types/PermitType";
import { PermitCondition } from "../types/PermitCondition";
import { PowerUnit, Trailer } from "../../manageVehicles/types/Vehicle";
import { Nullable, RequiredOrNull } from "../../../common/types/common";
import { CompanyProfile } from "../../manageProfile/types/manageProfile.d";
import { PermitLOA } from "../types/PermitLOA";
import { VehicleInConfiguration } from "../types/PermitVehicleConfiguration";
import {
  PAST_START_DATE_STATUSES,
  PastStartDateStatus,
} from "../../../common/components/form/subFormComponents/CustomDatePicker";

interface ApplicationFormContextType {
  initialFormData: ApplicationFormData;
  formData: ApplicationFormData;
  policyEngine: RequiredOrNull<Policy>;
  durationOptions: {
    value: number;
    label: string;
  }[];
  allVehiclesFromInventory: (PowerUnit | Trailer)[];
  powerUnitSubtypeNamesMap: Map<string, string>;
  trailerSubtypeNamesMap: Map<string, string>;
  isLcvDesignated: boolean;
  feature: string;
  companyInfo?: Nullable<CompanyProfile>;
  isAmendAction: boolean;
  createdDateTime?: Nullable<Dayjs>;
  updatedDateTime?: Nullable<Dayjs>;
  pastStartDateStatus: PastStartDateStatus;
  companyLOAs: LOADetail[];
  revisionHistory: {
    permitId: number;
    name: string;
    revisionDateTime: string;
    comment: string;
  }[];
  commodityOptions: {
    value: string;
    label: string;
  }[];
  onLeave?: () => void;
  onSave?: () => Promise<void>;
  onCancel?: () => void;
  onContinue: () => Promise<void>;
  onSetDuration: (duration: number) => void;
  onSetExpiryDate: (expiry: Dayjs) => void;
  onSetConditions: (conditions: PermitCondition[]) => void;
  onToggleSaveVehicle: (saveVehicle: boolean) => void;
  onSetVehicle: (vehicleDetails: PermitVehicleDetails) => void;
  onClearVehicle: (saveVehicle: boolean) => void;
  onUpdateLOAs: (updatedLOAs: PermitLOA[]) => void;
  onUpdateHighwaySequence: (updatedHighwaySequence: string[]) => void;
  onUpdateVehicleConfigTrailers: (updatedTrailerSubtypes: VehicleInConfiguration[]) => void;
}

export const ApplicationFormContext = createContext<ApplicationFormContextType>({
  initialFormData: getDefaultValues(DEFAULT_PERMIT_TYPE, undefined),
  formData: getDefaultValues(DEFAULT_PERMIT_TYPE, undefined),
  policyEngine: null,
  durationOptions: [],
  allVehiclesFromInventory: [],
  powerUnitSubtypeNamesMap: new Map<string, string>(),
  trailerSubtypeNamesMap: new Map<string, string>(),
  isLcvDesignated: false,
  feature: "",
  companyInfo: undefined,
  isAmendAction: false,
  createdDateTime: undefined,
  updatedDateTime: undefined,
  pastStartDateStatus: PAST_START_DATE_STATUSES.ALLOWED,
  companyLOAs: [],
  revisionHistory: [],
  commodityOptions: [],
  onLeave: undefined,
  onSave: undefined,
  onCancel: undefined,
  onContinue: async () => undefined,
  onSetDuration: () => undefined,
  onSetExpiryDate: () => undefined,
  onSetConditions: () => undefined,
  onToggleSaveVehicle: () => undefined,
  onSetVehicle: () => undefined,
  onClearVehicle: () => undefined,
  onUpdateLOAs: () => undefined,
  onUpdateHighwaySequence: () => undefined,
  onUpdateVehicleConfigTrailers: () => undefined,
});
