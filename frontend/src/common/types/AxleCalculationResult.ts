type PolicyCheckResultType = "pass" | "fail";

export const AXLE_CALCULATION_RESULT_ID_TYPES = {
  NUMBER_OF_AXLES: "number-of-axles",
  NUMBER_OF_WHEELS: "number-of-wheels",
  BRIDGE_FORMULA: "bridge-formula",
  CHECK_PERMITTABLE_WEIGHT: "check-permittable-weight",
  MAX_TIRE_LOAD: "max-tire-load",
  MINIMUM_DRIVE_AXLE_WEIGHT: "minimum-drive-axle-weight",
  MINIMUM_STEER_AXLE_WEIGHT: "minimum-steer-axle-weight",
} as const;

type AxleCalculationResultIdType =
  (typeof AXLE_CALCULATION_RESULT_ID_TYPES)[keyof typeof AXLE_CALCULATION_RESULT_ID_TYPES];

export interface AxleGroupPolicyCheckResult {
  id: AxleCalculationResultIdType;
  result: PolicyCheckResultType;
  message: string;
  axleUnit?: number;
  actualWeight?: number;
  thresholdWeight?: number;
  startAxleUnit: number;
  endAxleUnit: number;
}

export interface AxleCalculationResult {
  results: Array<AxleGroupPolicyCheckResult>;
  totalOverload: number;
}
