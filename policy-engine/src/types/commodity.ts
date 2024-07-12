import {
  IdentifiedObject,
  PowerUnit,
  Trailer,
} from 'onroute-policy-engine/types';

export type Commodity = IdentifiedObject & {
  powerUnits?: Array<PowerUnit>;
  trailers?: Array<Trailer>;
};
