import { Nullable } from "../../../common/types/common";

export interface ManualRoute {
  highwaySequence: string[];
  origin: string;
  destination: string;
  exitPoint?: Nullable<string>;
  totalDistance?: Nullable<number>;
  entryPoint?: Nullable<string>;
}

export interface PermittedRoute {
  manualRoute?: Nullable<ManualRoute>;
  routeDetails?: Nullable<string>;
}
