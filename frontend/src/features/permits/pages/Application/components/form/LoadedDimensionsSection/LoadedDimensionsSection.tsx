import { Box } from "@mui/material";

import "./LoadedDimensionsSection.scss";
import { CustomFormComponent } from "../../../../../../../common/components/form/CustomFormComponents";
import { requiredMessage } from "../../../../../../../common/helpers/validationMessages";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";

export const LoadedDimensionsSection = ({
  permitType,
  feature,
}: {
  permitType: PermitType;
  feature: string;
}) => {
  return permitType === PERMIT_TYPES.STOS ? (
    <Box className="loaded-dimensions-section">
      <Box className="loaded-dimensions-section__header">
        <h3 className="loaded-dimensions-section__title">
          Loaded Dimensions (Metres)
        </h3>
      </Box>

      <Box className="loaded-dimensions-section__body">
        <div className="loaded-dimensions-section__input-row loaded-dimensions-section__input-row--first">
          <CustomFormComponent
            className="loaded-dimensions-section__input loaded-dimensions-section__input--first"
            type="input"
            feature={feature}
            options={{
              name: "permitData.vehicleConfiguration.overallWidth",
              rules: {
                required: { value: true, message: requiredMessage() },
              },
              label: "Overall Width",
            }}
          />

          <CustomFormComponent
            className="loaded-dimensions-section__input"
            type="input"
            feature={feature}
            options={{
              name: "permitData.vehicleConfiguration.overallHeight",
              rules: {
                required: { value: true, message: requiredMessage() },
              },
              label: "Overall Height",
            }}
          />

          <CustomFormComponent
            className="loaded-dimensions-section__input"
            type="input"
            feature={feature}
            options={{
              name: "permitData.vehicleConfiguration.overallLength",
              rules: {
                required: { value: true, message: requiredMessage() },
              },
              label: "Overall Length",
            }}
          />
        </div>

        <div className="loaded-dimensions-section__input-row">
          <CustomFormComponent
            className="loaded-dimensions-section__input loaded-dimensions-section__input--first"
            type="input"
            feature={feature}
            options={{
              name: "permitData.vehicleConfiguration.frontProjection",
              rules: {
                required: { value: true, message: requiredMessage() },
              },
              label: "Front Projection",
            }}
          />

          <CustomFormComponent
            className="loaded-dimensions-section__input"
            type="input"
            feature={feature}
            options={{
              name: "permitData.vehicleConfiguration.rearProjection",
              rules: {
                required: { value: true, message: requiredMessage() },
              },
              label: "Rear Projection",
            }}
          />
        </div>
      </Box>
    </Box>
  ) : null;
};
