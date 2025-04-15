import { Nullable } from "../../../common/types/common";

export const LOA_STEPS = {
  BASIC: 0,
  REVIEW: 1,
} as const;

export type LOAStep = typeof LOA_STEPS[keyof typeof LOA_STEPS];

export const labelForLOAStep = (
  loaStep: LOAStep,
  loaNumber?: Nullable<number>,
) => {
  switch (loaStep) {
    case LOA_STEPS.REVIEW:
      return "Review and Confirm Details";
    default:
      return !loaNumber ? "Add an LOA" : `Editing LOA #: ${loaNumber}`;
  }
};
