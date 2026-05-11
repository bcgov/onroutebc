type PolicyCheckResultType = "pass" | "fail";

export const POLICY_CHECK_ID_TYPES = {
  BRIDGE_FORMULA: "bridge-formula",
  CHECK_PERMITTABLE_WEIGHT: "check-permittable-weight",
  MAX_TIRE_LOAD: "max-tire-load",
  MINIMUM_DRIVE_AXLE_WEIGHT: "minimum-drive-axle-weight",
  MINIMUM_STEER_AXLE_WEIGHT: "minimum-steer-axle-weight",
  NUMBER_OF_AXLES: "number-of-axles",
  NUMBER_OF_WHEELS_PER_AXLE: "number-of-wheels",
} as const;

export type PolicyCheckIdType =
  (typeof POLICY_CHECK_ID_TYPES)[keyof typeof POLICY_CHECK_ID_TYPES];

export interface AxleGroupPolicyCheckResult {
  id: PolicyCheckIdType;
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
