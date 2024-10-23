import { Box, MenuItem } from "@mui/material"

import "./CommodityDetailsSection.scss";
import { CustomFormComponent } from "../../../../../../common/components/form/CustomFormComponents";
import { requiredMessage } from "../../../../../../common/helpers/validationMessages";
import { PERMIT_TYPES, PermitType } from "../../../../types/PermitType";

export const CommodityDetailsSection = ({
  feature,
  permitType,
  commodityOptions,
}: {
  feature: string;
  permitType: PermitType;
  commodityOptions: {
    value: string;
    label: string;
  }[],
}) => {
  return permitType === PERMIT_TYPES.STOS ? (
    <Box className="commodity-details-section">
      <Box className="commodity-details-section__header">
        <h3>Commodity Details</h3>
      </Box>

      <Box className="commodity-details-section__body">
        <CustomFormComponent
          type="select"
          feature={feature}
          className="commodity-details-section__input commodity-details-section__input--commodity-type"
          options={{
            name: "permitData.permittedCommodity.commodityType",
            rules: {
              required: { value: true, message: requiredMessage() },
            },
            label: "Commodity Type",
          }}
          menuOptions={commodityOptions.map((commodityOption) => (
            <MenuItem key={commodityOption.value} value={commodityOption.value}>
              {commodityOption.label}
            </MenuItem>
          ))}
        />

        <CustomFormComponent
          type="input"
          feature={feature}
          className="commodity-details-section__input"
          options={{
            name: "permitData.permittedCommodity.loadDescription",
            rules: {
              required: { value: true, message: requiredMessage() },
            },
            label: "Load Description",
          }}
        />
      </Box>
    </Box>
  ) : null;
};
