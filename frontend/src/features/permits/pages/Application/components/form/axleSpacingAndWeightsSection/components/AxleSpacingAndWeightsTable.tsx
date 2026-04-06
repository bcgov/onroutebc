import "./AxleSpacingAndWeightsTable.scss";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { AxleUnitRow } from "./AxleUnitRow";
import { PermitVehicleDetails } from "../../../../../../types/PermitVehicleDetails";
import { ApplicationFormData } from "../../../../../../types/application";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { AxleUnitHelpModal } from "./AxleUnitHelpModal";
import { Nullable } from "../../../../../../../../common/types/common";
import { PermitVehicleConfiguration } from "../../../../../../types/PermitVehicleConfiguration";
import { AxleUnit } from "../../../../../../../../common/types/AxleUnit";

export const AxleSpacingAndWeightsTable = ({
  powerUnitSubtypeNamesMap,
  vehicleFormData,
  trailerSubtypeNamesMap,
  vehicleConfiguration,
}: {
  powerUnitSubtypeNamesMap: Map<string, string>;
  vehicleFormData: PermitVehicleDetails;
  trailerSubtypeNamesMap: Map<string, string>;
  vehicleConfiguration: Nullable<PermitVehicleConfiguration>;
}) => {
  const { control } = useFormContext<ApplicationFormData>();
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

  // Compute the starting axle unit number offset for a trailer row group.
  const getAxleUnitNumber = (trailerIndex: number) => {
    let offset = getCompleteAxleUnitCount(powerUnitAxleConfiguration);

    for (let i = 0; i < trailerIndex; i++) {
      offset += getCompleteAxleUnitCount(trailerAxleConfigurations[i]);
    }

    return offset;
  };

  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

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
              control={control}
              path="permitData.vehicleConfiguration.axleConfiguration"
              label={powerUnitSubtypeNamesMap.get(
                vehicleFormData.vehicleSubType,
              )}
              axleUnitNumber={0}
              isTrailer={false}
            />

            {trailers.map((trailer, trailerIndex) => (
              <AxleUnitRow
                key={`${trailer.vehicleSubType}-${trailerIndex}`}
                control={control}
                path={`permitData.vehicleConfiguration.trailers.${trailerIndex}.axleConfiguration`}
                label={trailerSubtypeNamesMap.get(trailer.vehicleSubType)}
                axleUnitNumber={getAxleUnitNumber(trailerIndex)}
                isTrailer={true}
              />
            ))}
          </tbody>
        </table>
      </div>
      <p className="axle-spacing-and-weights-table__legend">
        <strong>Legend:</strong> Interaxle Spacing (SPC); Axle Spread (SPD);
        Gross Combination Vehicle Weight (GCVW)
      </p>
      <AxleUnitHelpModal
        isOpen={isHelpModalOpen}
        onCancel={() => setIsHelpModalOpen(false)}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
};
