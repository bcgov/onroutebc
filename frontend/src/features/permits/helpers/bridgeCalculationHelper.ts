import { BridgeCalculationResult } from "../types/BridgeCalculationResult";

export const getFailedResultText = (failedResult: BridgeCalculationResult) =>
  `Bridge calculation failed between Axle Unit
    ${failedResult.startAxleUnit} and ${failedResult.endAxleUnit}, Axle Group
    Weight is ${failedResult.actualWeight}, Bridge Formula Weight max is
    ${failedResult.maxBridge}.`;
