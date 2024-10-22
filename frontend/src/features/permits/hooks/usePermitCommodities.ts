import { useMemo } from "react";

import { PERMIT_TYPES, PermitType } from "../types/PermitType";

export const usePermitCommodities = (permitType: PermitType) => {
  const commodityOptions = useMemo(() => {
    if (permitType !== PERMIT_TYPES.STOS) return [];

    return [
      { value: "TEST1", label: "Test Commodity 1" },
      { value: "TEST2", label: "Test Commodity 2" },
      { value: "TEST3", label: "Test Commodity 3" },
      { value: "TEST4", label: "Test Commodity 4" },
    ];
  }, [permitType]);

  return {
    commodityOptions,
  };
};
