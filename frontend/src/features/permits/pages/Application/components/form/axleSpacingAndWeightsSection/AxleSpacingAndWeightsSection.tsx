import { InfoBcGovBanner } from "../../../../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../../../../common/constants/bannerMessages";
import "./AxleSpacingAndWeightsSection.scss";
import { Box } from "@mui/material";
import { AxleSpacingAndWeightsTable } from "./components/AxleSpacingAndWeightsTable";
import { PermitVehicleDetails } from "../../../../../types/PermitVehicleDetails";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { Nullable } from "../../../../../../../common/types/common";
import { PermitVehicleConfiguration } from "../../../../../types/PermitVehicleConfiguration";
import {
  AxleConfiguration,
  AxleUnit,
} from "../../../../../../../common/types/AxleUnit";
import { BridgeCalculationResult } from "../../../../../../../common/types/BridgeCalculationResult";

export const AxleSpacingAndWeightsSection = ({
  permitType,
  selectedCommodityType,
  powerUnitSubtypeNamesMap,
  trailerSubtypeNamesMap,
  vehicleFormData,
  vehicleConfiguration,
  tireSizeOptions,
  calculateBridge,
  canAddAxleUnitsToPowerUnit,
  canAddAxleUnitsToTrailer,
  onUpdatePowerUnitAxleConfiguration,
  onUpdateTrailerAxleConfiguration,
}: {
  permitType: PermitType;
  selectedCommodityType?: Nullable<string>;
  powerUnitSubtypeNamesMap: Map<string, string>;
  trailerSubtypeNamesMap: Map<string, string>;
  vehicleFormData: PermitVehicleDetails;
  vehicleConfiguration: Nullable<PermitVehicleConfiguration>;
  tireSizeOptions?: Nullable<{ name: string; size: number }[]>;
  calculateBridge?: (
    axleConfiguration: AxleConfiguration[],
  ) => BridgeCalculationResult[];
  canAddAxleUnitsToPowerUnit?: (
    permitType: PermitType,
    commodityType?: string | null,
    powerUnitSubtype?: string | null,
  ) => boolean;
  canAddAxleUnitsToTrailer?: (
    permitType: PermitType,
    commodityType?: string | null,
    powerUnitSubtype?: string | null,
    trailerSubtype?: string | null,
  ) => boolean;
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
          permitType={permitType}
          selectedCommodityType={selectedCommodityType}
          powerUnitSubtypeNamesMap={powerUnitSubtypeNamesMap}
          vehicleFormData={vehicleFormData}
          trailerSubtypeNamesMap={trailerSubtypeNamesMap}
          vehicleConfiguration={vehicleConfiguration}
          tireSizeOptions={tireSizeOptions}
          calculateBridge={calculateBridge}
          canAddAxleUnitsToPowerUnit={canAddAxleUnitsToPowerUnit}
          canAddAxleUnitsToTrailer={canAddAxleUnitsToTrailer}
          onUpdatePowerUnitAxleConfiguration={
            onUpdatePowerUnitAxleConfiguration
          }
          onUpdateTrailerAxleConfiguration={onUpdateTrailerAxleConfiguration}
        />
      </Box>
    </Box>
  ) : null;
};
