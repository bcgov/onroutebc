import "./AmendReason.scss";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";
import { requiredMessage } from "../../../../../../common/helpers/validationMessages";
import { ORBCFormFeatureType } from "../../../../../../common/types/common";

export const AmendReason = ({ feature }: { feature: ORBCFormFeatureType }) => {
  return (
    <div className="amend-reason">
      <div className="amend-reason__label">Reason for Amendment</div>
      <CustomFormComponent
        type="textarea"
        feature={feature}
        options={{
          name: "comment",
          rules: {
            required: {
              value: true,
              message: requiredMessage(),
            },
          },
        }}
        className="amend-reason__input"
      />
    </div>
  );
};
