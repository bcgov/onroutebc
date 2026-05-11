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
import { isTrailerSubtypeNone } from "../../../../../../../manageVehicles/helpers/vehicleSubtypes";
import { getDefaultRequiredVal } from "../../../../../../../../common/helpers/util";
import { Button } from "@mui/material";
import { ErrorAltBcGovBanner } from "../../../../../../../../common/components/banners/ErrorAltBcGovBanner";
import { AxleUnitResetModal } from "./AxleUnitResetModal";
import { PermitType } from "../../../../../../types/PermitType";
import {
  AxleCalculationResult,
  AxleGroupPolicyCheckResult,
  POLICY_CHECK_ID_TYPES,
  PolicyCheckIdType,
} from "../../../../../../types/AxleCalculationResult";
import {
  combineAxleConfigurations,
  convertMetreValuesToCentimetres,
  getDefaultAxleConfiguration,
  mergeInteraxleSpacing,
} from "../../../../../../helpers/axleUnitHelper";
import { AxleConfiguration, AxleUnit } from "../../../../../../types/AxleUnit";
import {
  DEFAULT_POWER_UNIT_AXLE_CONFIG,
  DEFAULT_TRAILER_AXLE_CONFIG,
} from "../../../../../../constants/constants";

export const AxleSpacingAndWeightsTable = ({
  permitType,
  selectedCommodityType,
  powerUnitSubtypeNamesMap,
  vehicleFormData,
  trailerSubtypeNamesMap,
  vehicleConfiguration,
  tireSizeOptions,
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
  const [totalGCVW, setTotalGCVW] = useState<number>();
  const [axleCalculationResults, setAxleCalculationResults] =
    useState<AxleCalculationResult>();

  // Since we are not yet handling all evaluations returned from the policyEngine.runAxleCalculation(), this set allows us to filter the results to only those we have implemented.
  const DISPLAYABLE_POLICY_CHECK_IDS = new Set<PolicyCheckIdType>([
    POLICY_CHECK_ID_TYPES.BRIDGE_FORMULA,
    POLICY_CHECK_ID_TYPES.NUMBER_OF_AXLES,
  ]);

  const failedAxleCalculationResults = axleCalculationResults?.results.filter(
    (result) =>
      result.result === "fail" && DISPLAYABLE_POLICY_CHECK_IDS.has(result.id),
  );

  const hasAxleCalculationFailures = Boolean(
    failedAxleCalculationResults?.length,
  );

  const shouldShowResultsSection =
    showValidationBanner || Boolean(axleCalculationResults);

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

    const axleCalculationResults = runAxleCalculation?.(
      permitType,
      vehicleFormData,
      vehicleConfiguration as PermitVehicleConfiguration,
      serializedAxleConfigurationData,
      calculateGCVW(combinedAxleConfigurationData),
    );

    if (axleCalculationResults) {
      setAxleCalculationResults(axleCalculationResults);
      setTotalGCVW(calculateGCVW(combinedAxleConfigurationData));
    }
  };

  type RowType = "axle" | "spacing";

  const normalizeAxleConfigurationRows = (
    axleConfiguration: AxleUnit[],
    axleUnitNumber: number,
    isTrailer: boolean,
  ): { rowType: RowType; axleUnitNumber: number }[] => {
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

  const getAxleCalculationFailures = (
    axleConfiguration: AxleUnit[],
    axleUnitNumber: number,
    isTrailer: boolean,
  ): Array<Partial<Record<PolicyCheckIdType, boolean>>> => {
    const normalizedRows = normalizeAxleConfigurationRows(
      axleConfiguration,
      axleUnitNumber,
      isTrailer,
    );

    const doesResultApplyToRow = (
      rowType: RowType,
      rowAxleUnitNumber: number,
      result: AxleGroupPolicyCheckResult,
    ) => {
      // Most failures are specifically for a single axle unit
      if (rowType === "axle" && typeof result.axleUnit === "number") {
        return rowAxleUnitNumber === result.axleUnit;
      }

      // Bridge formula failures require highlighting multiple axle unit rows
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
      rowType: RowType,
    ): PolicyCheckIdType[] => {
      switch (result.id) {
        case POLICY_CHECK_ID_TYPES.NUMBER_OF_AXLES:
          return rowType === "axle"
            ? [POLICY_CHECK_ID_TYPES.NUMBER_OF_AXLES]
            : [];

        case POLICY_CHECK_ID_TYPES.BRIDGE_FORMULA:
          return [POLICY_CHECK_ID_TYPES.BRIDGE_FORMULA];

        default:
          return [];
      }
    };

    return normalizedRows.map(
      ({ rowType, axleUnitNumber: rowAxleUnitNumber }) => {
        const failures: Partial<Record<PolicyCheckIdType, boolean>> = {};

        getDefaultRequiredVal([], failedAxleCalculationResults).forEach(
          (result) => {
            if (!doesResultApplyToRow(rowType, rowAxleUnitNumber, result))
              return;
            fieldsForResult(result, rowType).forEach((field) => {
              failures[field] = true;
            });
          },
        );

        return failures;
      },
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
              axleCalculationFailures={getAxleCalculationFailures(
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
                  axleCalculationFailures={getAxleCalculationFailures(
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
          ) : hasAxleCalculationFailures ? (
            <>
              <span>
                <strong>Total (GCVW):</strong> {totalGCVW}
              </span>
              {getDefaultRequiredVal([], failedAxleCalculationResults).map(
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
