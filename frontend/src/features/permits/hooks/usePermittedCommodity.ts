import { useCallback, useMemo } from "react";
import { Policy } from "onroute-policy-engine";

import { getPermittedCommodityOptions } from "../helpers/permittedCommodity";
import { PermitType } from "../types/PermitType";
import { Nullable } from "../../../common/types/common";

export const usePermittedCommodity = (
  policyEngine: Policy,
  permitType: PermitType,
  onSetCommodityType: (commodityType: string) => void,
  onClearVehicle: () => void,
  onClearVehicleConfig: (permitType: PermitType) => void,
  selectedCommodityType?: Nullable<string>,
) => {
  const commodityOptions = useMemo(() => {
    return getPermittedCommodityOptions(permitType, policyEngine);
  }, [policyEngine, permitType]);

  const onChangeCommodityType = useCallback((commodityType: string) => {
    if (selectedCommodityType !== commodityType) {
      onSetCommodityType(commodityType);
      onClearVehicle();
      onClearVehicleConfig(permitType);
    }
  }, [
    onSetCommodityType,
    onClearVehicleConfig,
    selectedCommodityType,
    permitType,
  ]);

  return {
    commodityOptions,
    onChangeCommodityType,
  };
};
