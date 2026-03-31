/* eslint-disable @typescript-eslint/no-unused-vars */
import "./AxleSpacingAndWeightsTable.scss";
import { useContext, useEffect, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AxleUnitRow } from "./AxleUnitRow";
import { PermitVehicleDetails } from "../../../../../../types/PermitVehicleDetails";
import { ApplicationFormData } from "../../../../../../types/application";
import { ApplicationFormContext } from "../../../../../../context/ApplicationFormContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { AxleUnitHelpModal } from "./AxleUnitHelpModal";
import { AxleUnit } from "../../../../../../../bridgeFormulaCalculationTool/types/AxleUnit";
import { PermitVehicleConfiguration } from "../../../../../../types/PermitVehicleConfiguration";
import { VehicleInConfiguration } from "onroute-policy-engine/types";
import { Nullable } from "../../../../../../../../common/types/common";

export const AxleSpacingAndWeightsTable = ({
  powerUnitSubtypeNamesMap,
  vehicleFormData,
  trailerSubtypeNamesMap,
}: {
  powerUnitSubtypeNamesMap: Map<string, string>;
  vehicleFormData: PermitVehicleDetails;
  trailerSubtypeNamesMap: Map<string, string>;
}) => {
  const { control } = useFormContext<ApplicationFormData>();
  const { formData } = useContext(ApplicationFormContext);

  const { fields: trailerFields } = useFieldArray({
    control,
    name: "permitData.vehicleConfiguration.trailers",
  });

  const { fields: powerUnitAxleUnitFields } = useFieldArray({
    control,
    name: "permitData.vehicleConfiguration.axleConfiguration",
  });

  const trailers = formData.permitData.vehicleConfiguration?.trailers;

  const getCompleteAxleUnitCount = (units: any[] | undefined | null) => {
    if (!units) return 0;
    return Math.ceil(units.length / 2);
  };

  const getAxleUnitNumber = (trailerIndex: number) => {
    let offset = getCompleteAxleUnitCount(powerUnitAxleUnitFields);

    if (trailers) {
      for (let i = 0; i < trailerIndex; i++) {
        offset += getCompleteAxleUnitCount(trailers[i]?.axleConfiguration);
      }
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
            <AxleUnitRow
              control={control}
              path="permitData.vehicleConfiguration.axleConfiguration"
              label={powerUnitSubtypeNamesMap.get(
                vehicleFormData.vehicleSubType,
              )}
              axleUnitNumber={0}
              isTrailer={false}
            />

            {trailerFields.map((trailer, trailerIndex) => (
              <AxleUnitRow
                key={trailer.id}
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
