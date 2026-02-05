import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";

import "./TripDetails.scss";
import { Nullable } from "../../../../../../common/types/common";
import { DiffChip } from "./DiffChip";
import { PermittedRoute } from "../../../../types/PermittedRoute";
import { getDefaultRequiredVal } from "../../../../../../common/helpers/util";
import { areOrderedSequencesEqual, areValuesDifferent } from "../../../../../../common/helpers/equality";

export const TripDetails = ({
  routeDetails,
  oldRouteDetails,
  showChangedFields = false,
}: {
  routeDetails?: Nullable<PermittedRoute>;
  oldRouteDetails?: Nullable<PermittedRoute>;
  showChangedFields?: boolean;
}) => {
  const origin = getDefaultRequiredVal("", routeDetails?.manualRoute?.origin);
  const destination = getDefaultRequiredVal("", routeDetails?.manualRoute?.destination);
  const exitPoint = getDefaultRequiredVal("", routeDetails?.manualRoute?.exitPoint);
  const isReturnTrip = getDefaultRequiredVal(false, routeDetails?.manualRoute?.isReturnTrip);
  const totalDistanceStr = getDefaultRequiredVal(0, routeDetails?.manualRoute?.totalDistance).toFixed(2);
  const highwaySequence = getDefaultRequiredVal([], routeDetails?.manualRoute?.highwaySequence);
  const details = getDefaultRequiredVal("", routeDetails?.routeDetails);

  const changedFields = showChangedFields
    ? {
        origin: areValuesDifferent(
          routeDetails?.manualRoute?.origin,
          oldRouteDetails?.manualRoute?.origin,
        ),
        destination: areValuesDifferent(
          routeDetails?.manualRoute?.destination,
          oldRouteDetails?.manualRoute?.destination,
        ),
        exitPoint: areValuesDifferent(
          routeDetails?.manualRoute?.exitPoint,
          oldRouteDetails?.manualRoute?.exitPoint,
        ),
        isReturnTrip: areValuesDifferent(
          routeDetails?.manualRoute?.isReturnTrip,
          oldRouteDetails?.manualRoute?.isReturnTrip,
        ),
        totalDistance: areValuesDifferent(
          totalDistanceStr,
          getDefaultRequiredVal(0, oldRouteDetails?.manualRoute?.totalDistance).toFixed(2),
        ),
        highwaySequences: areOrderedSequencesEqual(
          routeDetails?.manualRoute?.highwaySequence,
          oldRouteDetails?.manualRoute?.highwaySequence,
          (seqNum, oldSeqNum) => seqNum === oldSeqNum,
        ),
        routeDetails: areValuesDifferent(
          routeDetails?.routeDetails,
          oldRouteDetails?.routeDetails,
        ),
      }
    : {
        origin: false,
        destination: false,
        exitPoint: false,
        isReturnTrip: false,
        totalDistance: false,
        highwaySequences: false,
        routeDetails: false,
      };

  const showDiffChip = (show: boolean) => {
    return show ? <DiffChip /> : null;
  };

  return routeDetails ? (
    <Box className="review-trip-details">
      <Box className="review-trip-details__header">
        <Typography variant={"h3"} className="review-trip-details__title">
          Trip Details
        </Typography>
      </Box>

      <Box className="review-trip-details__body">
        {routeDetails?.manualRoute ? (
          <Box className="manual-route">
            {origin ? (
              <div className="manual-route__origin">
                <Typography className="manual-route__label">
                  <span className="manual-route__label-text">Origin</span>

                  {showDiffChip(changedFields.origin)}
                </Typography>

                <Typography
                  className="manual-route__data"
                  data-testid="permit-route-origin"
                >
                  {origin}
                </Typography>
              </div>
            ) : null}
            
            {destination ? (
              <div className="manual-route__destination">
                <Typography className="manual-route__label">
                  <span className="manual-route__label-text">Destination</span>

                  {showDiffChip(changedFields.destination)}
                </Typography>

                <Typography
                  className="manual-route__data"
                  data-testid="permit-route-destination"
                >
                  {destination}
                </Typography>
              </div>
            ) : null}

            {isReturnTrip ? (
              <div className="manual-route__is-return-trip">
                <RadioGroup
                  className="manual-route__radio-group"
                  defaultValue={isReturnTrip}
                >
                  <FormControlLabel
                    key="is-return-trip"
                    className="return-trip-option"
                    disabled={true}
                    classes={{
                      disabled: "return-trip-option--disabled",
                      label: "return-trip-option__label",
                    }}
                    label="Return Trip"
                    value={isReturnTrip}
                    control={
                      <Radio
                        key="is-return-trip-true"
                        className="return-trip-option__radio return-trip-option__radio--disabled"
                      />}
                  />
                </RadioGroup>

                <Typography className="manual-route__info">
                  <span className="manual-route__info-text">
                    Permitted for return trip along the same route.
                  </span>

                  {showDiffChip(changedFields.isReturnTrip)}
                </Typography>
              </div>
            ) : null}

            {exitPoint ? (
              <div className="manual-route__exit">
                <Typography className="manual-route__label">
                  <span className="manual-route__label-text">Exit Point</span>

                  {showDiffChip(changedFields.exitPoint)}
                </Typography>

                <Typography
                  className="manual-route__data"
                  data-testid="permit-route-exit"
                >
                  {exitPoint}
                </Typography>
              </div>
            ) : null}

            {Number(totalDistanceStr) > 0 ? (
              <div className="manual-route__total-distance">
                <Typography className="manual-route__label">
                  <span className="manual-route__label-text">Total Distance (km)</span>

                  {showDiffChip(changedFields.totalDistance)}
                </Typography>

                <Typography
                  className="manual-route__data"
                  data-testid="permit-route-total-distance"
                >
                  {totalDistanceStr}
                </Typography>
              </div>
            ) : null}
          </Box>
        ) : null}

        {highwaySequence.length > 0 ? (
          <Box className="review-highway-sequences">
            <div className="review-highway-sequences__header">
              <Typography variant="h4">
                Sequences of highways to be travelled
              </Typography>
              
              {showDiffChip(changedFields.highwaySequences)}
            </div>
            
            <div className="review-highway-sequences__sequences">
              {highwaySequence.map((highwaySequence, index) => (
                <Typography
                  key={`${highwaySequence}-${index}`}
                  className="review-highway-sequences__sequence"
                >
                  {highwaySequence}
                </Typography>
              ))}
            </div>
          </Box>
        ) : null}

        {details ? (
          <Box className="specific-route">
            <Typography className="specific-route__label">
              <span className="specific-route__label-text">
                Specific Route Details
              </span>

              {showDiffChip(changedFields.routeDetails)}
            </Typography>

            <Typography
              className="specific-route__data"
              data-testid="permit-specific-route-details"
            >
              {details}
            </Typography>
          </Box>
        ) : null}
      </Box>
    </Box>
  ) : null;
};
