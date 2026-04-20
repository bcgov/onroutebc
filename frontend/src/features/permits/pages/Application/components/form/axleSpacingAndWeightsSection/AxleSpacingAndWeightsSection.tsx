import { InfoBcGovBanner } from "../../../../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../../../../common/constants/bannerMessages";
import "./AxleSpacingAndWeightsSection.scss";
import { Box } from "@mui/material";
import { AxleSpacingAndWeightsTable } from "./components/AxleSpacingAndWeightsTable";
import { PermitVehicleDetails } from "../../../../../types/PermitVehicleDetails";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { Nullable } from "../../../../../../../common/types/common";
import { PermitVehicleConfiguration } from "../../../../../types/PermitVehicleConfiguration";
import { AxleUnit } from "../../../../../../../common/types/AxleUnit";

export const AxleSpacingAndWeightsSection = ({
  permitType,
  powerUnitSubtypeNamesMap,
  trailerSubtypeNamesMap,
  vehicleFormData,
  vehicleConfiguration,
  onUpdatePowerUnitAxleConfiguration,
  onUpdateTrailerAxleConfiguration,
}: {
  permitType: PermitType;
  powerUnitSubtypeNamesMap: Map<string, string>;
  trailerSubtypeNamesMap: Map<string, string>;
  vehicleFormData: PermitVehicleDetails;
  vehicleConfiguration: Nullable<PermitVehicleConfiguration>;
  onUpdatePowerUnitAxleConfiguration: (axleConfiguration: AxleUnit[]) => void;
  onUpdateTrailerAxleConfiguration: (
    trailerIndex: number,
    axleConfiguration: AxleUnit[],
  ) => void;
}) => {
  return permitType === PERMIT_TYPES.STOW && vehicleFormData.vin ? (
    <Box className="axle-spacing-and-weights-section">
      <InfoBcGovBanner
        className="axle-spacing-and-weights-section__info"
        msg={
          <>
            <>Conversion Facts: </>
            <span className="axle-spacing-and-weights-info__details">
              {BANNER_MESSAGES.CONVERSION_FACTS}
            </span>
          </>
        }
      />

      <Box className="axle-spacing-and-weights-section__header">
        <h3>Axle Spacing and Weights</h3>
      </Box>
      <Box className="axle-spacing-and-weights-section-section__body">
        <AxleSpacingAndWeightsTable
          powerUnitSubtypeNamesMap={powerUnitSubtypeNamesMap}
          vehicleFormData={vehicleFormData}
          trailerSubtypeNamesMap={trailerSubtypeNamesMap}
          vehicleConfiguration={vehicleConfiguration}
          onUpdatePowerUnitAxleConfiguration={
            onUpdatePowerUnitAxleConfiguration
          }
          onUpdateTrailerAxleConfiguration={onUpdateTrailerAxleConfiguration}
        />
      </Box>
    </Box>
  ) : null;
};
