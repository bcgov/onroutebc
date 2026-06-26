import { InfoBcGovBanner } from "../../../../../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../../../../../common/constants/bannerMessages";
import "./AxleSpacingAndWeightsSection.scss";
import { Box } from "@mui/material";
import { AxleSpacingAndWeightsTable } from "./components/AxleSpacingAndWeightsTable";
import { PermitVehicleDetails } from "../../../../../types/PermitVehicleDetails";
import { PERMIT_TYPES, PermitType } from "../../../../../types/PermitType";
import { Nullable } from "../../../../../../../common/types/common";
import {
  PermitVehicleConfiguration,
  VehicleInConfiguration,
} from "../../../../../types/PermitVehicleConfiguration";
import { AxleCalculationResult } from "../../../../../types/AxleCalculationResult";
import { AxleUnit, AxleConfiguration } from "../../../../../types/AxleUnit";

export const AxleSpacingAndWeightsSection = ({
  permitType,
  selectedCommodityType,
  powerUnitSubtypeNamesMap,
  trailerSubtypeNamesMap,
  vehicleFormData,
  vehicleConfiguration,
  axleCalculationResults,
  tireSizeOptions,
  runAxleCalculation,
  canAddAxleUnitsToPowerUnit,
  canAddAxleUnitsToTrailer,
  combineAxleConfigurations,
  calculateGCVW,
  onUpdatePowerUnitAxleConfiguration,
  onUpdateTrailerAxleConfiguration,
}: {
  permitType: PermitType;
  selectedCommodityType?: Nullable<string>;
  powerUnitSubtypeNamesMap: Map<string, string>;
  trailerSubtypeNamesMap: Map<string, string>;
  vehicleFormData: PermitVehicleDetails;
  vehicleConfiguration: Nullable<PermitVehicleConfiguration>;
  axleCalculationResults?: AxleCalculationResult | null;
  tireSizeOptions?: Nullable<{ name: string; size: number }[]>;
  runAxleCalculation?: (
    permitType: PermitType,
    vehicleDetails: PermitVehicleDetails,
    vehicleConfiguration: PermitVehicleConfiguration,
    axleConfiguration: AxleConfiguration[],
    licensedGVW: number,
  ) => AxleCalculationResult;
  canAddAxleUnitsToPowerUnit?: (
    permitType: PermitType,
    commodityType?: Nullable<string>,
    powerUnitSubtype?: Nullable<string>,
  ) => boolean;
  canAddAxleUnitsToTrailer?: (
    permitType: PermitType,
    commodityType?: Nullable<string>,
    powerUnitSubtype?: Nullable<string>,
    trailerSubtype?: Nullable<string>,
  ) => boolean;
  combineAxleConfigurations?: (
    powerUnitAxleConfiguration: AxleConfiguration[],
    trailers: VehicleInConfiguration[],
  ) => AxleConfiguration[];
  calculateGCVW?: (axleConfiguration: AxleConfiguration[]) => number;
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
          axleCalculationResults={axleCalculationResults}
          tireSizeOptions={tireSizeOptions}
          runAxleCalculation={runAxleCalculation}
          canAddAxleUnitsToPowerUnit={canAddAxleUnitsToPowerUnit}
          canAddAxleUnitsToTrailer={canAddAxleUnitsToTrailer}
          combineAxleConfigurations={combineAxleConfigurations}
          calculateGCVW={calculateGCVW}
          onUpdatePowerUnitAxleConfiguration={
            onUpdatePowerUnitAxleConfiguration
          }
          onUpdateTrailerAxleConfiguration={onUpdateTrailerAxleConfiguration}
        />
      </Box>
    </Box>
  ) : null;
};
