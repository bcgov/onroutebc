import "./SpecificRouteDetails.scss";
import { CustomFormComponent } from "../../../../../../../common/components/form/CustomFormComponents";
import { requiredMessage } from "../../../../../../../common/helpers/validationMessages";
import { ORBCFormFeatureType } from "../../../../../../../common/types/common";

export const SpecificRouteDetails = ({
  feature,
}: {
  feature: ORBCFormFeatureType;
}) => {
  return (
    <div className="specific-route-details">
      <CustomFormComponent
        type="textarea"
        feature={feature}
        className="specific-route-details__input"
        options={{
          name: "permitData.permittedRoute.routeDetails",
          rules: {
            required: { value: true, message: requiredMessage() },
          },
          label: "Specific Route Details",
        }}
      />

      <p className="specific-route-details__helper-text">
        e.g. From the Alberta/BC border to 10 km north on Highway 23 near
        Revelstoke.
      </p>
    </div>
  );
};
