export const IDPS = {
  BCEID: "bceidbusiness",
  IDIR: "idir",
} as const;

export type IDP = (typeof IDPS)[keyof typeof IDPS];
