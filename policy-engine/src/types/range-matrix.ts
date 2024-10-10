import { IdentifiedObject } from 'onroute-policy-engine/types';

export type RangeMatrix = IdentifiedObject & {
  matrix: Matrix[];
};

export type Matrix = {
  min?: number;
  max?: number;
  value: number;
};
