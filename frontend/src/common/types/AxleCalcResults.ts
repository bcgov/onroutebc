type PolicyCheckResultType = "pass" | "fail";

export interface AxleGroupPolicyCheckResult {
  startAxleUnit: number;
  endAxleUnit: number;
  actualWeight?: number;
  thresholdWeight?: number;
  id: string;
  result: PolicyCheckResultType;
  message: string;
}

export interface AxleCalcResults {
  results: Array<AxleGroupPolicyCheckResult>;
  totalOverload: number;
}
