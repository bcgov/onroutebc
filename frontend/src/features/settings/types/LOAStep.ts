export const LOA_STEPS = {
  BASIC: 0,
  VEHICLES: 1,
  REVIEW: 2,
} as const;

export type LOAStep = typeof LOA_STEPS[keyof typeof LOA_STEPS];

export const labelForLOAStep = (loaStep: LOAStep) => {
  switch (loaStep) {
    case LOA_STEPS.REVIEW:
      return "Review and Confirm Details";
    case LOA_STEPS.VEHICLES:
      return "Designate Vehicle(s)";
    default:
      return "Basic Information";
  }
};
