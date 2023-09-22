import { Box } from "@mui/material";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { Dayjs } from "dayjs";

import "./PermitForm.scss";
import { FormActions } from "./FormActions";
import { ApplicationDetails } from "../../../../components/form/ApplicationDetails";
import { ContactDetails } from "../../../../components/form/ContactDetails";
import { PermitDetails } from "./PermitDetails";
import { VehicleDetails } from "./VehicleDetails/VehicleDetails";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { PowerUnit, Trailer } from "../../../../../manageVehicles/types/managevehicles";
import { 
  Application, 
  Commodities, 
  PermitType, 
  VehicleDetails as VehicleDetailsType, 
} from "../../../../types/application.d";

import { 
  usePowerUnitTypesQuery, 
  useTrailerTypesQuery,
} from "../../../../../manageVehicles/apiManager/hooks";

interface PermitFormProps {
  feature: string;
  onLeave?: () => void;
  onSave?: () => Promise<void>;
  onCancel?: () => void;
  onContinue: () => Promise<void>;
  isAmendAction: boolean;
  formMethods: UseFormReturn<Application>;
  permitType: PermitType;
  applicationNumber?: string;
  permitNumber?: string;
  createdDateTime?: Dayjs;
  updatedDateTime?: Dayjs;
  permitStartDate: Dayjs;
  permitDuration: number;
  permitCommodities: Commodities[];
  vehicleDetails?: VehicleDetailsType;
  vehicleChoices: (PowerUnit | Trailer)[];
}

export const PermitForm = (props: PermitFormProps) => {
  // Queries used to populate select options for vehicle details
  const powerUnitTypesQuery = usePowerUnitTypesQuery();
  const trailerTypesQuery = useTrailerTypesQuery();

  // Vehicle details that have been fetched by vehicle details queries
  const fetchedPowerUnitTypes = getDefaultRequiredVal([], powerUnitTypesQuery.data);
  const fetchedTrailerTypes = getDefaultRequiredVal([], trailerTypesQuery.data);

  return (
    <Box className="permit-form layout-box">
      <Box className="permit-form__form">
        <FormProvider {...props.formMethods}>
          <ApplicationDetails
            permitType={props.permitType}
            applicationNumber={props.isAmendAction ? undefined : props.applicationNumber}
            permitNumber={props.isAmendAction ? props.permitNumber : undefined}
            createdDateTime={props.createdDateTime}
            updatedDateTime={props.updatedDateTime}
          />
          <ContactDetails feature={props.feature} />
          <PermitDetails
            feature={props.feature}
            defaultStartDate={props.permitStartDate}
            defaultDuration={props.permitDuration}
            commodities={props.permitCommodities}
            applicationNumber={props.applicationNumber}
          />
          <VehicleDetails
            feature={props.feature}
            vehicleData={props.vehicleDetails}
            vehicleOptions={props.vehicleChoices}
            powerUnitTypes={fetchedPowerUnitTypes}
            trailerTypes={fetchedTrailerTypes}
          />
          {props.isAmendAction ? (
            <></>
          ) : null}
        </FormProvider>
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
