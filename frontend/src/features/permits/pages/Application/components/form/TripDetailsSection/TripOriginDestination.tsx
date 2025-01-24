import "./TripOriginDestination.scss";
import { CustomFormComponent } from "../../../../../../../common/components/form/CustomFormComponents";
import { invalidAddress, requiredMessage } from "../../../../../../../common/helpers/validationMessages";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { Nullable } from "../../../../../../../common/types/common";

export const TripOriginDestination = ({
  feature,
  permitType,
  onUpdateTripTotalDistance,
}: {
  feature: string;
  permitType: PermitType;
  onUpdateTripTotalDistance: (updatedTotalDistance?: Nullable<number>) => void;
}) => {
  const showExitPointDistance = permitType === PERMIT_TYPES.MFP;

  return (
    <div className="trip-origin-destination">
      <CustomFormComponent
        className="trip-origin-destination__input trip-origin-destination__input--origin"
        type="input"
        feature={feature}
        options={{
          name: "permitData.permittedRoute.manualRoute.origin",
          rules: {
            required: { value: true, message: invalidAddress() },
          },
          label: "Origin",
        }}
      />

      <CustomFormComponent
        className="trip-origin-destination__input"
        type="input"
        feature={feature}
        options={{
          name: "permitData.permittedRoute.manualRoute.destination",
          rules: {
            required: { value: true, message: invalidAddress() },
          },
          label: "Destination",
        }}
      />
      
      {showExitPointDistance ? (
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

      {showExitPointDistance ? (
        <CustomFormComponent
          className="trip-origin-destination__input"
          type="input"
          feature={feature}
          options={{
            name: "permitData.permittedRoute.manualRoute.totalDistance",
            rules: {
              required: { value: true, message: requiredMessage() },
            },
            label: "Exit Point",
          }}
        />
      ) : null}
    </div>
  );
};
