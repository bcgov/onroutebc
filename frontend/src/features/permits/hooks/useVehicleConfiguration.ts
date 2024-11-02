import { useCallback, useMemo } from "react";
import { Policy } from "onroute-policy-engine";

import { PermitType } from "../types/PermitType";

export const useVehicleConfiguration = (
  policyEngine: Policy,
  permitType: PermitType,
  selectedCommodity: string,
  selectedSubtypes: string[],
  selectedPowerUnitSubtype: string,
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

  const nextAllowedSubtypes = useMemo(() => {
    if (!selectedCommodity || !selectedPowerUnitSubtype) return [];

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
