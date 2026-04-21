/* eslint-disable @typescript-eslint/no-unused-vars */
import "./AxleSpacingAndWeightsTable.scss";
import { useState } from "react";
import { AxleUnitRow } from "./AxleUnitRow";
import { PermitVehicleDetails } from "../../../../../../types/PermitVehicleDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { AxleUnitHelpModal } from "./AxleUnitHelpModal";
import { Nullable } from "../../../../../../../../common/types/common";
import { PermitVehicleConfiguration } from "../../../../../../types/PermitVehicleConfiguration";
import { AxleUnit } from "../../../../../../../../common/types/AxleUnit";
import { isTrailerSubtypeNone } from "../../../../../../../manageVehicles/helpers/vehicleSubtypes";
import { Button } from "@mui/material";
import {
  convertMetreValuesToCentimetres,
  getDefaultAxleConfiguration,
  mergeInteraxleSpacing,
} from "../../../../../../../../common/helpers/axleUnitHelper";
import { usePolicyEngine } from "../../../../../../../policy/hooks/usePolicyEngine";
import { ErrorAltBcGovBanner } from "../../../../../../../../common/components/banners/ErrorAltBcGovBanner";
import { BridgeCalculationResult } from "../../../../../../../../common/types/BridgeCalculationResult";
import { getFailedResultText } from "../../../../../../../../common/helpers/bridgeCalculationHelper";

export const AxleSpacingAndWeightsTable = ({
  powerUnitSubtypeNamesMap,
  vehicleFormData,
  trailerSubtypeNamesMap,
  vehicleConfiguration,
  onUpdatePowerUnitAxleConfiguration,
  onUpdateTrailerAxleConfiguration,
}: {
  powerUnitSubtypeNamesMap: Map<string, string>;
  vehicleFormData: PermitVehicleDetails;
  trailerSubtypeNamesMap: Map<string, string>;
  vehicleConfiguration: Nullable<PermitVehicleConfiguration>;
  onUpdatePowerUnitAxleConfiguration: (axleConfiguration: AxleUnit[]) => void;
  onUpdateTrailerAxleConfiguration: (
    trailerIndex: number,
    axleConfiguration: AxleUnit[],
  ) => void;
}) => {
  const policyEngine = usePolicyEngine();
  const trailers = vehicleConfiguration?.trailers ?? [];

  const powerUnitAxleConfiguration =
    vehicleConfiguration?.axleConfiguration ?? [];

  const trailerAxleConfigurations: AxleUnit[][] = trailers.map(
    (trailer) => trailer.axleConfiguration ?? [],
  );

  // Convert axle rows into the number of full axle units.
  const getCompleteAxleUnitCount = (axleUnits: AxleUnit[]) => {
    return Math.ceil(axleUnits.length / 2);
  };

  // Create a merged array of all vehicle components (power unit + trailers)
  const vehicleComponents = (() => {
    const components = [];

    // Add power unit
    components.push({
      axleConfiguration: powerUnitAxleConfiguration,
      label: powerUnitSubtypeNamesMap.get(vehicleFormData.vehicleSubType),
      isTrailer: false,
      startAxleUnitNumber: 0,
      onUpdateAxleConfiguration: onUpdatePowerUnitAxleConfiguration,
    });

    // Add trailers
    let currentAxleUnitNumber = getCompleteAxleUnitCount(
      powerUnitAxleConfiguration,
    );

    trailers.forEach((trailer, trailerIndex) => {
      if (!isTrailerSubtypeNone(trailer.vehicleSubType)) {
        components.push({
          axleConfiguration: trailer.axleConfiguration ?? [],
          label: trailerSubtypeNamesMap.get(trailer.vehicleSubType),
          isTrailer: true,
          startAxleUnitNumber: currentAxleUnitNumber,
          onUpdateAxleConfiguration: (axleConfiguration: AxleUnit[]) =>
            onUpdateTrailerAxleConfiguration(trailerIndex, axleConfiguration),
        });
        currentAxleUnitNumber += getCompleteAxleUnitCount(
          trailerAxleConfigurations[trailerIndex],
        );
      }
    });

    return components;
  })();

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

  const calculateBridgeFormula = () => {
    setShowValidationBanner(false);

    // Merge all axle configurations from all vehicle components
    const mergedAxleConfigurationData = vehicleComponents.flatMap(
      (component) => {
        const mergedComponentConfig = mergeInteraxleSpacing(
          component.axleConfiguration,
          component.isTrailer ? 0 : 1,
        );
        return mergedComponentConfig;
      },
    );

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

    const bridgeCalculationResults = policyEngine?.calculateBridge(
      serializedAxleConfigurationData,
    );

    if (bridgeCalculationResults) {
      setBridgeCalculationResults(bridgeCalculationResults);
    }

    console.log(bridgeCalculationResults);
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
                  className="column__button"
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
                  className="column__button"
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
            {vehicleComponents.map((component, componentIndex) => (
              <AxleUnitRow
                key={`${component.isTrailer ? "trailer" : "powerunit"}-${componentIndex}`}
                axleConfiguration={component.axleConfiguration}
                label={component.label}
                axleUnitNumber={component.startAxleUnitNumber}
                isTrailer={component.isTrailer}
                onUpdateAxleConfiguration={component.onUpdateAxleConfiguration}
                axleUnitFailure={failedBridgeCalculationResults.some(
                  (result) => {
                    const componentStart = component.startAxleUnitNumber;
                    const componentEnd =
                      componentStart +
                      getCompleteAxleUnitCount(component.axleConfiguration) -
                      1;
                    return (
                      componentStart <= result.endAxleUnit &&
                      componentEnd >= result.startAxleUnit
                    );
                  },
                )}
              />
            ))}
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
            setShowValidationBanner(false);
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
          <h2 className="results__heading">
            Bridge Formula Calculation Results
          </h2>

          {showValidationBanner ? (
            <ErrorAltBcGovBanner msg="All fields in Axle Spacing and Weights are required to calculate results." />
          ) : failedBridgeCalculationResults.length ? (
            <>
              <strong>Total (GCVW):</strong> 69300
              {failedBridgeCalculationResults.map((failedResult, index) => (
                <div key={index}>
                  <p key={index} className="results__text results__text--fail">
                    {getFailedResultText(failedResult)}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <>
              <strong>Total (GCVW):</strong> 69300
              <p className="results__text results__text--success">
                &#x2713; Bridge Calculation is ok.
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
    </div>
  );
};
