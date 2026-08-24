import { useEffect, useState } from "react";

import { AxleUnit } from "../../../../../../types/AxleUnit";
import { AxleCalculationResult } from "../../../../../../types/AxleCalculationResult";
import {
  AxleSpacingAndWeightsTable,
  AxleSpacingAndWeightsTableProps,
} from "./AxleSpacingAndWeightsTable";
import { AxleSpacingAndWeightsResults } from "./AxleSpacingAndWeightsResults";

type AxleSpacingAndWeightsProps = Omit<
  AxleSpacingAndWeightsTableProps,
  | "onAxleCalculationResultsChange"
  | "onValidationBannerChange"
  | "onUpdatePowerUnitAxleConfiguration"
  | "onUpdateTrailerAxleConfiguration"
> & {
  onUpdatePowerUnitAxleConfiguration?: (axleConfiguration: AxleUnit[]) => void;
  onUpdateTrailerAxleConfiguration?: (
    trailerIndex: number,
    axleConfiguration: AxleUnit[],
  ) => void;
};

const noUpdatePowerUnitAxleConfiguration = () => undefined;
const noUpdateTrailerAxleConfiguration = () => undefined;

export const AxleSpacingAndWeights = ({
  axleCalculationResultsFromValidation,
  showASWRequiredFieldsBanner,
  onUpdatePowerUnitAxleConfiguration,
  onUpdateTrailerAxleConfiguration,
  ...tableProps
}: AxleSpacingAndWeightsProps) => {
  const [axleCalculationResults, setAxleCalculationResults] =
    useState<AxleCalculationResult>();
  const [showValidationBanner, setShowValidationBanner] = useState(
    showASWRequiredFieldsBanner,
  );

  useEffect(() => {
    if (axleCalculationResultsFromValidation) {
      setAxleCalculationResults(axleCalculationResultsFromValidation);
      setShowValidationBanner(false);
    }
  }, [axleCalculationResultsFromValidation]);

  useEffect(() => {
    if (showASWRequiredFieldsBanner) setShowValidationBanner(true);
  }, [showASWRequiredFieldsBanner]);

  return (
    <>
      <AxleSpacingAndWeightsTable
        {...tableProps}
        axleCalculationResultsFromValidation={
          axleCalculationResultsFromValidation
        }
        showASWRequiredFieldsBanner={showASWRequiredFieldsBanner}
        onUpdatePowerUnitAxleConfiguration={
          onUpdatePowerUnitAxleConfiguration ??
          noUpdatePowerUnitAxleConfiguration
        }
        onUpdateTrailerAxleConfiguration={
          onUpdateTrailerAxleConfiguration ?? noUpdateTrailerAxleConfiguration
        }
        onAxleCalculationResultsChange={setAxleCalculationResults}
        onValidationBannerChange={setShowValidationBanner}
      />
      <AxleSpacingAndWeightsResults
        axleCalculationResults={axleCalculationResults}
        showValidationBanner={showValidationBanner}
      />
    </>
  );
};
