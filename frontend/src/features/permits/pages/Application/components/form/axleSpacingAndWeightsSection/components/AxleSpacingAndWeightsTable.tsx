/* eslint-disable @typescript-eslint/no-unused-vars */
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
  combineAxleConfigurations,
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
import {
  AxleCalculationResult,
  AxleGroupPolicyCheckResult,
  AXLE_CALCULATION_RESULT_ID_TYPES,
} from "../../../../../../../../common/types/AxleCalculationResult";

export const AxleSpacingAndWeightsTable = ({
  permitType,
  selectedCommodityType,
  powerUnitSubtypeNamesMap,
  vehicleFormData,
  trailerSubtypeNamesMap,
  vehicleConfiguration,
  tireSizeOptions,
  calculateBridge,
  runAxleCalculation,
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

  const [axleCalculationResults, setAxleCalculationResults] =
    useState<AxleCalculationResult>();

  const failedAxleCalculationResults = axleCalculationResults?.results.filter(
    (result) => result.result === "fail",
  );

  const failedNumberOfAxlesResults = failedAxleCalculationResults?.filter(
    (result) => result.id === AXLE_CALCULATION_RESULT_ID_TYPES.NUMBER_OF_AXLES,
  );

  const [totalGCVW, setTotalGCVW] = useState<number>();

  const hasAxleCalculationFailures = Boolean(failedAxleCalculationResults?.length);
  const hasNumberOfAxlesFailures = Boolean(failedNumberOfAxlesResults?.length);

  const shouldShowResultsSection =
    showValidationBanner ||
    failedBridgeCalculationResults.length ||
    hasNumberOfAxlesFailures ||
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
        getDefaultRequiredVal(0, axleUnit.numberOfAxles) <= 1 ||
        axleUnit.axleSpread !== null;

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

  const handleCalculateBridge = () => {
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

  const handleCalculate = () => {
    setShowValidationBanner(false);

    // Merge all axle configurations from power unit and trailers
    const mergedPowerUnit = mergeInteraxleSpacing(
      powerUnitAxleConfiguration,
      1,
    );

    const mergedTrailers = trailers.map((trailer) => {
      if (!isTrailerSubtypeNone(trailer.vehicleSubType)) {
        return {
          ...trailer,
          axleConfiguration: mergeInteraxleSpacing(
            getDefaultRequiredVal([], trailer.axleConfiguration),
            0,
          ),
        };
      }

      return trailer;
    });

    const combinedAxleConfigurationData = combineAxleConfigurations(
      mergedPowerUnit,
      mergedTrailers,
    );

    if (!validateAxleConfiguration(combinedAxleConfigurationData)) {
      setShowValidationBanner(true);
      return;
    }

    const convertedAxleConfigurationData = combinedAxleConfigurationData.map(
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
      setTotalGCVW(calculateGCVW(serializedAxleConfigurationData));
    }

    const axleCalculationResults = runAxleCalculation?.(
      permitType,
      vehicleFormData,
      vehicleConfiguration as PermitVehicleConfiguration,
      serializedAxleConfigurationData,
      calculateGCVW(combinedAxleConfigurationData),
    );

    if (axleCalculationResults) {
      console.log({ axleCalculationResults });
      setAxleCalculationResults(axleCalculationResults);
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

  type AxleUnitRowFieldKey =
    | "numberOfAxles"
    | "numberOfTires"
    | "tireSize"
    | "interaxleSpacing"
    | "axleSpread"
    | "axleUnitWeight";

  const getAxleUnitFieldFailures = (
    axleConfiguration: AxleUnit[],
    axleUnitNumber: number,
    isTrailer: boolean,
  ): Array<Partial<Record<AxleUnitRowFieldKey, boolean>>> => {
    const normalizedRows = normalizeAxleConfigurationRows(
      axleConfiguration,
      axleUnitNumber,
      isTrailer,
    );

    const failedResults = getDefaultRequiredVal([], failedAxleCalculationResults);

    const doesResultApplyToRow = (
      rowType: NormalizedAxleRow["rowType"],
      rowAxleUnitNumber: number,
      result: AxleGroupPolicyCheckResult,
    ) => {
      // Some results are specifically for a single axle unit
      if (rowType === "axle" && typeof result.axleUnit === "number") {
        return rowAxleUnitNumber === result.axleUnit;
      }

      // Otherwise use the start/end range semantics (mirrors bridge highlighting rules)
      if (rowType === "axle") {
        return (
          rowAxleUnitNumber >= result.startAxleUnit &&
          rowAxleUnitNumber <= result.endAxleUnit
        );
      }

      return (
        rowAxleUnitNumber >= result.startAxleUnit &&
        rowAxleUnitNumber < result.endAxleUnit
      );
    };

    const fieldsForResult = (
      result: AxleGroupPolicyCheckResult,
      rowType: NormalizedAxleRow["rowType"],
    ): AxleUnitRowFieldKey[] => {
      switch (result.id) {
        case AXLE_CALCULATION_RESULT_ID_TYPES.NUMBER_OF_AXLES:
          return rowType === "axle" ? ["numberOfAxles"] : [];
        default:
          return [];
      }
    };

    return normalizedRows.map(({ rowType, axleUnitNumber: rowAxleUnitNumber }) => {
      const failures: Partial<Record<AxleUnitRowFieldKey, boolean>> = {};

      failedResults.forEach((result) => {
        if (!doesResultApplyToRow(rowType, rowAxleUnitNumber, result)) return;
        fieldsForResult(result, rowType).forEach((field) => {
          failures[field] = true;
        });
      });

      return failures;
    });
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
              axleUnitFieldFailures={getAxleUnitFieldFailures(
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
                  axleUnitFieldFailures={getAxleUnitFieldFailures(
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
          onClick={handleCalculate}
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
          ) : failedBridgeCalculationResults.length || hasNumberOfAxlesFailures ? (
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
              {getDefaultRequiredVal([], failedNumberOfAxlesResults).map(
                (failedResult, index) => (
                  <div key={`axle-calc-fail-${index}`}>
                    <p className="results__text results__text--fail">
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        className="results__icon results__icon--fail"
                      />{" "}
                      {failedResult.message}
                    </p>
                  </div>
                ),
              )}
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
