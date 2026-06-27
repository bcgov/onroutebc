export const POLICY_CHECK_RESULT_TYPES = {
  PASS: "pass",
  FAIL: "fail",
};

export type PolicyCheckResultType =
  (typeof POLICY_CHECK_RESULT_TYPES)[keyof typeof POLICY_CHECK_RESULT_TYPES];

export const POLICY_CHECK_ID_TYPES = {
  BOOSTER_AXLE_LIMIT: "booster-axle-limit",
  BRIDGE_FORMULA: "bridge-formula",
  CHECK_PERMITTABLE_WEIGHT: "check-permittable-weight",
  DRIVE_JEEP_LOAD_EQUALIZATION: "drive-jeep-load-equalization",
  MAX_TIRE_LOAD: "max-tire-load",
  MINIMUM_DRIVE_AXLE_WEIGHT: "minimum-drive-axle-weight",
  MINIMUM_STEER_AXLE_WEIGHT: "minimum-steer-axle-weight",
  MINIMUM_TANDEM_STEER_AXLE_WEIGHT: "minimum-tandem-steer-axle-weight",
  NUMBER_OF_AXLES: "number-of-axles",
  NUMBER_OF_WHEELS_PER_AXLE: "number-of-wheels",
  PICKER_TRUCK_TRACTOR_WEIGHT_RESTRICTIONS:
    "picker-truck-tractor-weight-restrictions",
  TRUCK_TRACTOR_WHEELBASE: "truck-tractor-wheelbase",
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
