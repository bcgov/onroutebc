import { useCallback, useEffect, useMemo } from "react";
import { Policy } from "onroute-policy-engine";

import { PERMIT_TYPES, PermitType } from "../types/PermitType";
import { VehicleInConfiguration } from "../types/PermitVehicleConfiguration";

export const useVehicleConfiguration = (
  policyEngine: Policy,
  permitType: PermitType,
  selectedCommodity: string,
  selectedSubtypes: string[],
  selectedPowerUnitSubtype: string,
  onUpdateVehicleConfigTrailers:
    (updatedTrailerSubtypes: VehicleInConfiguration[]) => void,
) => {
  const getNextAllowedVehicleSubtypes = useCallback(
    (selectedCommodity: string, selectedSubtypes: string[]) => {
      const nextAllowedSubtypes = policyEngine.getNextPermittableVehicles(
        permitType,
        selectedCommodity,
        selectedSubtypes,
      );

      return [...nextAllowedSubtypes.entries()]
        .map(([subtypeCode, subtypeFullName]) => ({
          value: subtypeCode,
          label: subtypeFullName,
        }));
    },
    [policyEngine, permitType],
  );

  useEffect(() => {
    if (permitType === PERMIT_TYPES.STOS) {
      if (selectedSubtypes.length > 0 && !policyEngine.isConfigurationValid(
        permitType,
        selectedCommodity,
        [selectedPowerUnitSubtype, ...selectedSubtypes],
        true,
      )) {
        onUpdateVehicleConfigTrailers([]);
      }
    }
  }, [
    permitType,
    policyEngine,
    selectedCommodity,
    selectedPowerUnitSubtype,
    selectedSubtypes,
    onUpdateVehicleConfigTrailers,
  ]);

  const nextAllowedSubtypes = useMemo(() => {
    if ((permitType !== PERMIT_TYPES.STOS)
      || !selectedCommodity
      || !selectedPowerUnitSubtype
    ) {
      return [];
    }

    return getNextAllowedVehicleSubtypes(
      selectedCommodity,
      [selectedPowerUnitSubtype, ...selectedSubtypes],
    ).filter(({ value }) => !selectedSubtypes.includes(value));
  }, [
    selectedCommodity,
    selectedSubtypes,
    selectedPowerUnitSubtype,
    getNextAllowedVehicleSubtypes,
  ]);

  return {
    nextAllowedSubtypes,
  };
};
