import { useMemo } from "react";

export const useVehicleConfiguration = (
  selectedCommodity: string,
  selectedSubtypes: string[],
  selectedPowerUnitSubtype: string,
  getNextAllowedVehicleSubtypes: (selectedCommodity: string, selectedSubtypes: string[]) => {
    value: string;
    label: string;
  }[],
) => {
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
