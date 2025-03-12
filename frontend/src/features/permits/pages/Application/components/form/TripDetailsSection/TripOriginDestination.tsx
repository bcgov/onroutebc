import { Controller } from "react-hook-form";

import "./TripOriginDestination.scss";
import { CustomFormComponent } from "../../../../../../../common/components/form/CustomFormComponents";
import { invalidAddress, invalidInput, requiredMessage } from "../../../../../../../common/helpers/validationMessages";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { Nullable, RequiredOrNull } from "../../../../../../../common/types/common";
import { NumberInput } from "../../../../../../../common/components/form/subFormComponents/NumberInput";
import { getDefaultRequiredVal } from "../../../../../../../common/helpers/util";
import { convertToNumberIfValid } from "../../../../../../../common/helpers/numeric/convertToNumberIfValid";
import { InfoBcGovBanner } from "../../../../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../../../../common/constants/bannerMessages";
import { GeocoderInput } from "../../../../../../../common/components/form/GeocoderInput";

export const TripOriginDestination = ({
  feature,
  permitType,
  tripOrigin,
  tripDestination,
  totalDistance,
  onUpdateTripOrigin,
  onUpdateTripDestination,
  onUpdateTotalDistance,
}: {
  feature: string;
  permitType: PermitType;
  tripOrigin?: Nullable<string>;
  tripDestination?: Nullable<string>;
  totalDistance?: Nullable<number>;
  onUpdateTripOrigin: (updateTripOrigin: string) => void;
  onUpdateTripDestination: (updateTripDestination: string) => void;
  onUpdateTotalDistance: (updatedTotalDistance?: RequiredOrNull<number>) => void;
}) => {
  const showExitPoint = permitType === PERMIT_TYPES.MFP;
  const showTotalDistance = permitType === PERMIT_TYPES.MFP;

  const origin = getDefaultRequiredVal("", tripOrigin);

  const handleUpdateTotalDistance = (numericStr: string) => {
    const updatedTotalDistance = getDefaultRequiredVal(
      null,
      convertToNumberIfValid(numericStr, null),
    );

    onUpdateTotalDistance(updatedTotalDistance);
  };

  return (
    <div className="trip-origin-destination">
      <Controller
        name="permitData.permittedRoute.manualRoute.origin"
        rules={{
          required: { value: true, message: invalidAddress() },
        }}
        render={({ fieldState: { error } }) => (
          <GeocoderInput
            label={{
              id: "trip-origin-label",
              component: "Origin",
            }}
            classes={{
              root: "trip-origin-destination__input trip-origin-destination__input--origin",
            }}
            selectedAddress={origin}
            onSelectAddress={onUpdateTripOrigin}
            helperText={
              error?.message
                ? {
                    errors: [error.message],
                  }
                : undefined
            }
          />
        )}
      />

      <Controller
        name="permitData.permittedRoute.manualRoute.destination"
        rules={{
          required: { value: true, message: invalidAddress() },
        }}
        render={({ fieldState: { error } }) => (
          <GeocoderInput
            label={{
              id: "trip-destionation-label",
              component: "Destination",
            }}
            classes={{
              root: "trip-origin-destination__input trip-origin-destination__input--destination",
            }}
            selectedAddress={tripDestination}
            onSelectAddress={onUpdateTripDestination}
            helperText={
              error?.message
                ? {
                    errors: [error.message],
                  }
                : undefined
            }
          />
        )}
      />
      
      {showExitPoint ? (
        <CustomFormComponent
          className="trip-origin-destination__input"
          type="input"
          feature={feature}
          options={{
            name: "permitData.permittedRoute.manualRoute.exitPoint",
            rules: {
              required: false,
            },
            label: "Exit Point",
          }}
        />
      ) : null}

      {showTotalDistance ? (
        <InfoBcGovBanner
          className="trip-origin-destination__info"
          msg={BANNER_MESSAGES.TOTAL_DISTANCE}
        />
      ) : null}

      {showTotalDistance ? (
        <Controller
          name="permitData.permittedRoute.manualRoute.totalDistance"
          rules={{
            required: { value: true, message: requiredMessage() },
            min: { value: 0.01, message: invalidInput() },
          }}
          render={({ fieldState: {error} }) => (
            <NumberInput
              label={{
                id: `${feature}-manual-route-total-distance-label`,
                component: "Total Distance (km)",
              }}
              classes={{
                root: "trip-origin-destination__input trip-origin-destination__input--total-distance",
              }}
              inputProps={{
                value: getDefaultRequiredVal(null, totalDistance),
                maskFn: (numericVal) => numericVal.toFixed(2),
                onBlur: (e) => {
                  handleUpdateTotalDistance(e.target.value);
                },
                slotProps: {
                  input: {
                    min: 0,
                    step: 0.01,
                  },
                },
              }}
              helperText={error?.message ? {
                errors: [error.message],
              } : undefined}
            />
          )}
        />
      ) : null}
    </div>
  );
};
