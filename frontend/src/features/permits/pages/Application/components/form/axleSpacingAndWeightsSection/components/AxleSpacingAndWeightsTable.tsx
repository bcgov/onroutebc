import "./AxleSpacingAndWeightsTable.scss";
import { useState } from "react";
import { AxleUnitRow } from "./AxleUnitRow";
import { PermitVehicleDetails } from "../../../../../../types/PermitVehicleDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import {
  faCircleXmark,
  faCircleCheck,
} from "@fortawesome/free-regular-svg-icons";
import { AxleUnitHelpModal } from "./AxleUnitHelpModal";
import { Nullable } from "../../../../../../../../common/types/common";
import { PermitVehicleConfiguration } from "../../../../../../types/PermitVehicleConfiguration";
import {
  AxleConfiguration,
  AxleUnit,
} from "../../../../../../../../common/types/AxleUnit";
import { isTrailerSubtypeNone } from "../../../../../../../manageVehicles/helpers/vehicleSubtypes";
import { getDefaultRequiredVal } from "../../../../../../../../common/helpers/util";
import { Button } from "@mui/material";
import {
  convertMetreValuesToCentimetres,
  getDefaultAxleConfiguration,
  mergeInteraxleSpacing,
} from "../../../../../../../../common/helpers/axleUnitHelper";
import {
  DEFAULT_POWER_UNIT_AXLE_CONFIG,
  DEFAULT_TRAILER_AXLE_CONFIG,
} from "../../../../../../../../common/constants/defaultAxleUnit";
import { ErrorAltBcGovBanner } from "../../../../../../../../common/components/banners/ErrorAltBcGovBanner";
import { BridgeCalculationResult } from "../../../../../../../../common/types/BridgeCalculationResult";
import { getFailedResultText } from "../../../../../../../../common/helpers/bridgeCalculationHelper";
import { AxleUnitResetModal } from "./AxleUnitResetModal";
import { PermitType } from "../../../../../../types/PermitType";

export const AxleSpacingAndWeightsTable = ({
  permitType,
  selectedCommodityType,
  powerUnitSubtypeNamesMap,
  vehicleFormData,
  trailerSubtypeNamesMap,
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
  vehicleFormData: PermitVehicleDetails;
  trailerSubtypeNamesMap: Map<string, string>;
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
  const trailers = getDefaultRequiredVal([], vehicleConfiguration?.trailers);

  const powerUnitAxleConfiguration = getDefaultRequiredVal(
    [],
    vehicleConfiguration?.axleConfiguration,
  );

  const trailerAxleConfigurations: AxleUnit[][] = trailers.map((trailer) =>
    getDefaultRequiredVal([], trailer.axleConfiguration),
  );

  // Convert axle rows into the number of full axle units.
  const getCompleteAxleUnitCount = (axleUnits: AxleUnit[]) => {
    return Math.ceil(axleUnits.length / 2);
  };

  // Compute the starting axle unit number offset for a trailer row group.
  const getAxleUnitNumber = (trailerIndex: number) => {
    let offset = getCompleteAxleUnitCount(powerUnitAxleConfiguration);

    for (let i = 0; i < trailerIndex; i++) {
      offset += getCompleteAxleUnitCount(trailerAxleConfigurations[i]);
    }

    return offset;
  };

  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [showValidationBanner, setShowValidationBanner] =
    useState<boolean>(false);

  const [bridgeCalculationResults, setBridgeCalculationResults] = useState<
    BridgeCalculationResult[]
  >([]);

  const failedBridgeCalculationResults = bridgeCalculationResults.filter(
    (result) => !result.success,
  );

  const bridgeCalculationSuccess = bridgeCalculationResults.length
    ? bridgeCalculationResults.every((result) => result.success)
    : false;

  const [totalGCVW, setTotalGCVW] = useState<number>();

  const shouldShowResultsSection =
    showValidationBanner ||
    failedBridgeCalculationResults.length ||
    bridgeCalculationSuccess;

  const validateAxleConfiguration = (
    axleConfiguration: AxleUnit[],
  ): boolean => {
    return axleConfiguration.every((axleUnit, index) => {
      // All axle units in merged data need all required fields
      const hasRequiredFields =
        axleUnit.numberOfAxles !== null &&
        axleUnit.numberOfTires !== null &&
        axleUnit.tireSize !== null &&
        axleUnit.axleUnitWeight !== null;

      // axleSpread is required unless numberOfAxles === 1
      const hasAxleSpread =
        axleUnit.numberOfAxles === 1 || axleUnit.axleSpread !== null;

      // interaxleSpacing is required for all but the first axle unit (i.e. the first axle unit of the power unit)
      const hasInteraxleSpacing =
        index === 0 || axleUnit.interaxleSpacing !== null;

      return hasRequiredFields && hasAxleSpread && hasInteraxleSpacing;
    });
  };

  const calculateGCVW = (axleConfiguration: AxleUnit[]): number => {
    return axleConfiguration.reduce((totalWeight, axleUnit) => {
      const axleUnitWeight = axleUnit.axleUnitWeight ?? 0;
      return totalWeight + axleUnitWeight;
    }, 0);
  };

  const calculateBridgeFormula = () => {
    setShowValidationBanner(false);

    // Merge all axle configurations from power unit and trailers
    const mergedPowerUnit = mergeInteraxleSpacing(
      powerUnitAxleConfiguration,
      1,
    );
    const mergedTrailers = trailers.flatMap((trailer) => {
      if (!isTrailerSubtypeNone(trailer.vehicleSubType)) {
        return mergeInteraxleSpacing(trailer.axleConfiguration ?? [], 0);
      }
      return [];
    });
    const mergedAxleConfigurationData = [...mergedPowerUnit, ...mergedTrailers];

    if (!validateAxleConfiguration(mergedAxleConfigurationData)) {
      setShowValidationBanner(true);
      return;
    }

    const convertedAxleConfigurationData = mergedAxleConfigurationData.map(
      (axleUnit) => convertMetreValuesToCentimetres(axleUnit),
    );

    const serializedAxleConfigurationData = convertedAxleConfigurationData.map(
      (axleUnit) => getDefaultAxleConfiguration(axleUnit),
    );

    const bridgeCalculationResults = calculateBridge?.(
      serializedAxleConfigurationData,
    );

    if (bridgeCalculationResults) {
      setBridgeCalculationResults(bridgeCalculationResults);
      setTotalGCVW(calculateGCVW(mergedAxleConfigurationData));
    }
  };

  interface NormalizedAxleRow {
    rowType: "axle" | "spacing";
    axleUnitNumber: number;
  }

  const normalizeAxleConfigurationRows = (
    axleConfiguration: AxleUnit[],
    axleUnitNumber: number,
    isTrailer: boolean,
  ): NormalizedAxleRow[] => {
    return axleConfiguration.map((_, index) => {
      const isInteraxleSpacingRow = isTrailer
        ? index % 2 === 0
        : index % 2 === 1;

      if (isInteraxleSpacingRow) {
        const associatedAxleUnitNumber = isTrailer
          ? axleUnitNumber + Math.floor(index / 2)
          : axleUnitNumber + Math.floor(index / 2) + 1;

        return {
          rowType: "spacing",
          axleUnitNumber: associatedAxleUnitNumber,
        };
      }

      return {
        rowType: "axle",
        axleUnitNumber: axleUnitNumber + Math.floor(index / 2) + 1,
      };
    });
  };

  const getAxleUnitFailures = (
    axleConfiguration: AxleUnit[],
    axleUnitNumber: number,
    isTrailer: boolean,
  ) => {
    const normalizedRows = normalizeAxleConfigurationRows(
      axleConfiguration,
      axleUnitNumber,
      isTrailer,
    );

    return normalizedRows.map(({ rowType, axleUnitNumber }) =>
      failedBridgeCalculationResults.some((result) => {
        if (rowType === "axle") {
          return (
            axleUnitNumber >= result.startAxleUnit &&
            axleUnitNumber <= result.endAxleUnit
          );
        }

        return (
          axleUnitNumber >= result.startAxleUnit &&
          axleUnitNumber < result.endAxleUnit
        );
      }),
    );
  };

  const handleReset = () => {
    onUpdatePowerUnitAxleConfiguration(DEFAULT_POWER_UNIT_AXLE_CONFIG);

    trailers.forEach((_, trailerIndex) => {
      onUpdateTrailerAxleConfiguration(
        trailerIndex,
        DEFAULT_TRAILER_AXLE_CONFIG,
      );
    });

    setShowValidationBanner(false);
    setBridgeCalculationResults([]);
    setTotalGCVW(undefined);
    setIsResetModalOpen(false);
  };

  return (
    <div className="axle-spacing-and-weights-table">
      <div className="table-container">
        <table className="table">
          <thead className="table__head">
            <tr>
              <th className="column__label">
                Axle <br></br>Unit
                <button
                  type="button"
                  className="column__button column__button--help"
                  onClick={() => setIsHelpModalOpen(true)}
                >
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="button__icon"
                  />
                </button>
              </th>
              <th className="column__label">
                No. of Axles{" "}
                <button
                  type="button"
                  className="column__button column__button--help"
                  onClick={() => setIsHelpModalOpen(true)}
                >
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="button__icon"
                  />
                </button>
              </th>
              <th className="column__label">No. of Wheels</th>
              <th className="column__label">Tire Size (mm)</th>
              <th className="column__label">
                Interaxle <br></br> Spacing (m)
              </th>
              <th className="column__label">
                Axle <br></br> Spread (m)
              </th>
              <th className="column__label">
                Axle Unit <br></br> Weight (kg)
              </th>
            </tr>
          </thead>
          <tbody>
            <AxleUnitRow
              key="powerunit"
              axleConfiguration={powerUnitAxleConfiguration}
              label={powerUnitSubtypeNamesMap.get(
                vehicleFormData.vehicleSubType,
              )}
              axleUnitNumber={0}
              isTrailer={false}
              onUpdateAxleConfiguration={onUpdatePowerUnitAxleConfiguration}
              tireSizeOptions={getDefaultRequiredVal([], tireSizeOptions)}
              axleUnitFailures={getAxleUnitFailures(
                powerUnitAxleConfiguration,
                0,
                false,
              )}
              canAddAxleUnits={canAddAxleUnitsToPowerUnit?.(
                permitType,
                selectedCommodityType,
                vehicleFormData.vehicleSubType,
              )}
            />
            {trailers.map((trailer, trailerIndex) =>
              !isTrailerSubtypeNone(trailer.vehicleSubType) ? (
                <AxleUnitRow
                  key={`${trailer.vehicleSubType}-${trailerIndex}`}
                  axleConfiguration={getDefaultRequiredVal(
                    [],
                    trailer.axleConfiguration,
                  )}
                  label={trailerSubtypeNamesMap.get(trailer.vehicleSubType)}
                  axleUnitNumber={getAxleUnitNumber(trailerIndex)}
                  isTrailer={true}
                  onUpdateAxleConfiguration={(axleConfiguration: AxleUnit[]) =>
                    onUpdateTrailerAxleConfiguration(
                      trailerIndex,
                      axleConfiguration,
                    )
                  }
                  tireSizeOptions={getDefaultRequiredVal([], tireSizeOptions)}
                  axleUnitFailures={getAxleUnitFailures(
                    getDefaultRequiredVal([], trailer.axleConfiguration),
                    getAxleUnitNumber(trailerIndex),
                    true,
                  )}
                  canAddAxleUnits={canAddAxleUnitsToTrailer?.(
                    permitType,
                    selectedCommodityType,
                    vehicleFormData.vehicleSubType,
                    trailer.vehicleSubType,
                  )}
                />
              ) : null,
            )}
          </tbody>
        </table>
      </div>
      <p className="axle-spacing-and-weights-table__legend">
        <strong>Legend:</strong> Interaxle Spacing (SPC); Axle Spread (SPD);
        Gross Combination Vehicle Weight (GCVW)
      </p>
      <div className="button-container">
        <Button
          variant="contained"
          onClick={() => {
            setIsResetModalOpen(true);
          }}
          className="button button--reset"
        >
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={calculateBridgeFormula}
          className="button button--submit"
        >
          Calculate
        </Button>
      </div>
      {shouldShowResultsSection && (
        <div className="results">
          <h2 className="results__heading">Calculation Results</h2>

          {showValidationBanner ? (
            <ErrorAltBcGovBanner msg="All fields in Axle Spacing and Weights are required to calculate results." />
          ) : failedBridgeCalculationResults.length ? (
            <>
              <span>
                <strong>Total (GCVW):</strong> {totalGCVW}
              </span>
              {failedBridgeCalculationResults.map((failedResult, index) => (
                <div key={index}>
                  <p className="results__text results__text--fail">
                    <FontAwesomeIcon
                      icon={faCircleXmark}
                      className="results__icon results__icon--fail"
                    />{" "}
                    {getFailedResultText(failedResult)}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <>
              <span>
                <strong>Total (GCVW):</strong> {totalGCVW}
              </span>
              <p className="results__text results__text--success">
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="results__icon results__icon--success"
                />{" "}
                Bridge Calculation is ok.
              </p>
            </>
          )}
        </div>
      )}
      <AxleUnitHelpModal
        isOpen={isHelpModalOpen}
        onCancel={() => setIsHelpModalOpen(false)}
        onClose={() => setIsHelpModalOpen(false)}
      />
      <AxleUnitResetModal
        isOpen={isResetModalOpen}
        onCancel={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
      />
    </div>
  );
};
