import { SelfIssuable } from 'onroute-policy-engine/types';

export type DimensionModifier = SelfIssuable & {
  position: string;
  type?: string;
  category?: string;
  axles?: number;
  minInterAxleSpacing?: number;
  maxInterAxleSpacing?: number;
};
