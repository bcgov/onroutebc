export const IDPS = {
  BCEID: "bceidboth",
  IDIR: "idir",
} as const;

export type IDP = (typeof IDPS)[keyof typeof IDPS];
