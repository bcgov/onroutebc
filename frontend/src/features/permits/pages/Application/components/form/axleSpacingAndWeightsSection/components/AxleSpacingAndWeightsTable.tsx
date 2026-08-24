import "./AxleSpacingAndWeightsTable.scss";
import { useEffect, useRef, useState } from "react";
import { AxleUnitRow } from "./AxleUnitRow";
import { PermitVehicleDetails } from "../../../../../../types/PermitVehicleDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { AxleUnitHelpModal } from "./AxleUnitHelpModal";
import { Nullable } from "../../../../../../../../common/types/common";
import {
  PermitVehicleConfiguration,
  VehicleInConfiguration,
} from "../../../../../../types/PermitVehicleConfiguration";
import { isTrailerSubtypeNone } from "../../../../../../../manageVehicles/helpers/vehicleSubtypes";
import { getDefaultRequiredVal } from "../../../../../../../../common/helpers/util";
import { Button } from "@mui/material";
import { AxleUnitResetModal } from "./AxleUnitResetModal";
import { PermitType } from "../../../../../../types/PermitType";
import {
  AxleCalculationResult,
  AxleGroupPolicyCheckResult,
  POLICY_CHECK_ID_TYPES,
  POLICY_CHECK_RESULT_TYPES,
  PolicyCheckIdType,
} from "../../../../../../types/AxleCalculationResult";
import {
  convertMetreValuesToCentimetres,
  getDefaultAxleConfiguration,
  mergeInteraxleSpacing,
  validateAxleConfiguration,
} from "../../../../../../helpers/axleUnitHelper";
import { AxleConfiguration, AxleUnit } from "../../../../../../types/AxleUnit";
import {
  DEFAULT_POWER_UNIT_AXLE_CONFIG,
  DEFAULT_TRAILER_AXLE_CONFIG,
} from "../../../../../../constants/constants";
import {
  ASW_TABLE_ROW_TYPES,
  ASWTableRowType,
} from "../../../../../../types/ASWTableRowType";
import { DISPLAYABLE_POLICY_CHECK_IDS } from "./displayablePolicyCheckIds";

export type AxleSpacingAndWeightsTableProps = {
  permitType: PermitType;
  selectedCommodityType?: Nullable<string>;
  powerUnitSubtypeNamesMap: Map<string, string>;
  vehicleFormData: PermitVehicleDetails;
  trailerSubtypeNamesMap: Map<string, string>;
  vehicleConfiguration: Nullable<PermitVehicleConfiguration>;
  axleCalculationResultsFromValidation?: AxleCalculationResult | null;
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
  ) => AxleUnit[];
  onUpdatePowerUnitAxleConfiguration: (axleConfiguration: AxleUnit[]) => void;
  onUpdateTrailerAxleConfiguration: (
    trailerIndex: number,
    axleConfiguration: AxleUnit[],
  ) => void;
  onAxleCalculationResultsChange: (
    axleCalculationResults?: AxleCalculationResult,
  ) => void;
  onValidationBannerChange: (showValidationBanner: boolean) => void;
  showASWRequiredFieldsBanner: boolean;
  readOnly?: boolean;
};

export const AxleSpacingAndWeightsTable = ({
  permitType,
  selectedCommodityType,
  powerUnitSubtypeNamesMap,
  vehicleFormData,
  trailerSubtypeNamesMap,
  vehicleConfiguration,
  axleCalculationResultsFromValidation,
  tireSizeOptions,
  runAxleCalculation,
  canAddAxleUnitsToPowerUnit,
  canAddAxleUnitsToTrailer,
  combineAxleConfigurations,
  onUpdatePowerUnitAxleConfiguration,
  onUpdateTrailerAxleConfiguration,
  onAxleCalculationResultsChange,
  onValidationBannerChange,
  showASWRequiredFieldsBanner,
  readOnly = false,
}: AxleSpacingAndWeightsTableProps) => {
  const ASWTableRef = useRef<HTMLDivElement>(null);
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
  const [axleCalculationResults, setAxleCalculationResults] =
    useState<AxleCalculationResult>();

  useEffect(() => {
    if (axleCalculationResultsFromValidation) {
      setAxleCalculationResults(axleCalculationResultsFromValidation);

      // Scroll to table if new validation results are different from current
      if (
        !readOnly &&
        axleCalculationResultsFromValidation !== axleCalculationResults
      ) {
        ASWTableRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [axleCalculationResultsFromValidation]);

  useEffect(() => {
    if (showASWRequiredFieldsBanner) {
      // Scroll to table if required fields are missing
      ASWTableRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [showASWRequiredFieldsBanner]);

  const failedAxleCalculationResults = axleCalculationResults?.results.filter(
    (result) =>
      result.result === POLICY_CHECK_RESULT_TYPES.FAIL &&
      DISPLAYABLE_POLICY_CHECK_IDS.has(result.id as PolicyCheckIdType),
  );

  const handleCalculate = () => {
    onValidationBannerChange(false);

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

    // in order to validate trailer axle configurations we must create a flat array of them, it is important that we do this before calling combineAxleConfigurations, since this replaces undefined values with 0, which will incorrectly pass validation
    const trailerAxleConfigurationData: AxleUnit[] = [];

    mergedTrailers.forEach((trailer) => {
      if (trailer.axleConfiguration) {
        trailerAxleConfigurationData.push(...trailer.axleConfiguration);
      }
    });

    if (
      !validateAxleConfiguration(mergedPowerUnit) ||
      !validateAxleConfiguration(trailerAxleConfigurationData)
    ) {
      setAxleCalculationResults(undefined);
      onAxleCalculationResultsChange(undefined);
      onValidationBannerChange(true);
      return;
    }

    const combinedAxleConfigurationData = getDefaultRequiredVal(
      [],
      combineAxleConfigurations?.(
        mergedPowerUnit.map((axleUnit) =>
          getDefaultAxleConfiguration(axleUnit),
        ),
        mergedTrailers,
      ),
    );

    const convertedAxleConfigurationData = combinedAxleConfigurationData.map(
      (axleUnit) => convertMetreValuesToCentimetres(axleUnit),
    );

    const serializedAxleConfigurationData = convertedAxleConfigurationData.map(
      (axleUnit) => getDefaultAxleConfiguration(axleUnit),
    );

    const axleCalculationResults = runAxleCalculation?.(
      permitType,
      vehicleFormData,
      getDefaultRequiredVal({}, vehicleConfiguration),
      serializedAxleConfigurationData,
      getDefaultRequiredVal(0, vehicleFormData.licensedGVW),
    );

    if (axleCalculationResults) {
      setAxleCalculationResults(axleCalculationResults);
      onAxleCalculationResultsChange(axleCalculationResults);
    }
  };

  const normalizeAxleConfigurationRows = (
    axleConfiguration: AxleUnit[],
    axleUnitNumber: number,
    isTrailer: boolean,
  ): { rowType: ASWTableRowType; axleUnitNumber: number }[] => {
    return axleConfiguration.map((_, index) => {
      const isInteraxleSpacingRow = isTrailer
        ? index % 2 === 0
        : index % 2 === 1;

      if (isInteraxleSpacingRow) {
        const associatedAxleUnitNumber = isTrailer
          ? axleUnitNumber + Math.floor(index / 2)
          : axleUnitNumber + Math.floor(index / 2) + 1;

        return {
          rowType: ASW_TABLE_ROW_TYPES.SPACING,
          axleUnitNumber: associatedAxleUnitNumber,
        };
      }

      return {
        rowType: ASW_TABLE_ROW_TYPES.AXLE,
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
      rowType: ASWTableRowType,
      rowAxleUnitNumber: number,
      result: AxleGroupPolicyCheckResult,
    ) => {
      // Most failures are specifically for a single axle unit
      if (
        rowType === ASW_TABLE_ROW_TYPES.AXLE &&
        typeof result.axleUnit === "number"
      ) {
        return rowAxleUnitNumber === result.axleUnit;
      }

      // Bridge formula failures require highlighting multiple axle unit rows
      if (rowType === ASW_TABLE_ROW_TYPES.AXLE) {
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
      rowType: ASWTableRowType,
    ): PolicyCheckIdType[] => {
      switch (result.id) {
        case POLICY_CHECK_ID_TYPES.AXLE_GROUP_MAXIMUM_LEGAL_WEIGHT_THRESHOLD:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.AXLE_GROUP_MAXIMUM_LEGAL_WEIGHT_THRESHOLD]
            : [];

        case POLICY_CHECK_ID_TYPES.NUMBER_OF_AXLES:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.NUMBER_OF_AXLES]
            : [];

        case POLICY_CHECK_ID_TYPES.BOOSTER_AXLE_LIMIT:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.BOOSTER_AXLE_LIMIT]
            : [];

        case POLICY_CHECK_ID_TYPES.BRIDGE_FORMULA:
          return [POLICY_CHECK_ID_TYPES.BRIDGE_FORMULA];

        case POLICY_CHECK_ID_TYPES.DRIVE_JEEP_LOAD_EQUALIZATION:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.DRIVE_JEEP_LOAD_EQUALIZATION]
            : [];

        case POLICY_CHECK_ID_TYPES.LEGAL_AXLE_SPREAD:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.LEGAL_AXLE_SPREAD]
            : [];

        case POLICY_CHECK_ID_TYPES.LEGAL_INTERAXLE_SPACING:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.LEGAL_INTERAXLE_SPACING]
            : [];

        case POLICY_CHECK_ID_TYPES.LEGAL_WEIGHT:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.LEGAL_WEIGHT]
            : [];

        case POLICY_CHECK_ID_TYPES.MINIMUM_STEER_AXLE_WEIGHT:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.MINIMUM_STEER_AXLE_WEIGHT]
            : [];

        case POLICY_CHECK_ID_TYPES.MINIMUM_TANDEM_STEER_AXLE_WEIGHT:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.MINIMUM_TANDEM_STEER_AXLE_WEIGHT]
            : [];

        case POLICY_CHECK_ID_TYPES.MINIMUM_DRIVE_AXLE_WEIGHT:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.MINIMUM_DRIVE_AXLE_WEIGHT]
            : [];

        case POLICY_CHECK_ID_TYPES.PICKER_TRUCK_TRACTOR_WEIGHT_RESTRICTIONS:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.PICKER_TRUCK_TRACTOR_WEIGHT_RESTRICTIONS]
            : [];

        case POLICY_CHECK_ID_TYPES.NUMBER_OF_WHEELS_PER_AXLE:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.NUMBER_OF_WHEELS_PER_AXLE]
            : [];

        case POLICY_CHECK_ID_TYPES.MAX_TIRE_LOAD:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.MAX_TIRE_LOAD]
            : [];

        case POLICY_CHECK_ID_TYPES.PERMITTABLE_WEIGHT:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.PERMITTABLE_WEIGHT]
            : [];

        case POLICY_CHECK_ID_TYPES.WHEELBASE_LEGAL_LIMITS:
          return rowType === ASW_TABLE_ROW_TYPES.AXLE
            ? [POLICY_CHECK_ID_TYPES.WHEELBASE_LEGAL_LIMITS]
            : [];
        default:
          return [];
      }
    };

    const axleCalculationFailures: Partial<
      Record<PolicyCheckIdType, boolean>
    >[] = [];

    normalizedRows.forEach(({ rowType, axleUnitNumber: rowAxleUnitNumber }) => {
      const failures: Partial<Record<PolicyCheckIdType, boolean>> = {};

      getDefaultRequiredVal([], failedAxleCalculationResults).forEach(
        (result) => {
          if (!doesResultApplyToRow(rowType, rowAxleUnitNumber, result)) return;

          fieldsForResult(result, rowType).forEach((field) => {
            failures[field] = true;
          });
        },
      );

      axleCalculationFailures.push(failures);
    });
    return axleCalculationFailures;
  };

  const handleReset = () => {
    onUpdatePowerUnitAxleConfiguration(DEFAULT_POWER_UNIT_AXLE_CONFIG);
    trailers.forEach((trailer, trailerIndex) => {
      if (!isTrailerSubtypeNone(trailer.vehicleSubType)) {
        onUpdateTrailerAxleConfiguration(
          trailerIndex,
          DEFAULT_TRAILER_AXLE_CONFIG,
        );
      }
    });

    setAxleCalculationResults(undefined);
    onAxleCalculationResultsChange(undefined);
    onValidationBannerChange(false);
    setIsResetModalOpen(false);
  };

  return (
    <div
      className={`axle-spacing-and-weights-table${
        readOnly ? " axle-spacing-and-weights-table--read-only" : ""
      }`}
      ref={ASWTableRef}
    >
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
              readOnly={readOnly}
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
                  readOnly={readOnly}
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
      {!readOnly ? (
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
      ) : null}
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
