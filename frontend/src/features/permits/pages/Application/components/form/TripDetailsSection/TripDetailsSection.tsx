import { Box } from "@mui/material";

import "./TripDetailsSection.scss";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { TripOriginDestination } from "./TripOriginDestination";
import { SpecificRouteDetails } from "./SpecificRouteDetails";
import { HighwaySequences } from "./HighwaySequences";
import {
  Nullable,
  ORBCFormFeatureType,
  RequiredOrNull,
} from "../../../../../../../common/types/common";

export const TripDetailsSection = ({
  feature,
  permitType,
  highwaySequence,
  tripOrigin,
  tripDestination,
  totalDistance,
  isReturnTrip,
  onUpdateHighwaySequence,
  onUpdateTripOrigin,
  onUpdateTripDestination,
  onUpdateTotalDistance,
  onUpdateIsReturnTrip,
}: {
  feature: ORBCFormFeatureType;
  permitType: PermitType;
  highwaySequence: string[];
  tripOrigin?: Nullable<string>;
  tripDestination?: Nullable<string>;
  totalDistance?: Nullable<number>;
  isReturnTrip?: Nullable<boolean>;
  onUpdateHighwaySequence: (updatedHighwaySequence: string[]) => void;
  onUpdateTripOrigin: (updateTripOrigin: string) => void;
  onUpdateTripDestination: (updateTripDestination: string) => void;
  onUpdateTotalDistance: (
    updatedTotalDistance?: RequiredOrNull<number>,
  ) => void;
  onUpdateIsReturnTrip: (updatedIsReturnTrip: boolean) => void;
}) => {
  return permitType === PERMIT_TYPES.STOS || permitType === PERMIT_TYPES.MFP ? (
    <Box className="trip-details-section">
      <Box className="trip-details-section__header">
        <h3 className="trip-details-section__title">Trip Details</h3>
      </Box>

      <Box className="trip-details-section__body">
        <TripOriginDestination
          feature={feature}
          permitType={permitType}
          tripOrigin={tripOrigin}
          tripDestination={tripDestination}
          totalDistance={totalDistance}
          isReturnTrip={isReturnTrip}
          onUpdateTripOrigin={onUpdateTripOrigin}
          onUpdateTripDestination={onUpdateTripDestination}
          onUpdateTotalDistance={onUpdateTotalDistance}
          onUpdateIsReturnTrip={onUpdateIsReturnTrip}
        />

        {permitType === PERMIT_TYPES.STOS ? (
          <HighwaySequences
            highwaySequence={highwaySequence}
            onUpdateHighwaySequence={onUpdateHighwaySequence}
          />
        ) : null}

        <SpecificRouteDetails feature={feature} />
      </Box>
    </Box>
  ) : null;
};
