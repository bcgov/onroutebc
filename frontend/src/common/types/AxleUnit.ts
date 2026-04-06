import { RequiredOrNull } from "./common";

export interface AxleUnit {
  numberOfAxles?: RequiredOrNull<number>;
  axleSpread?: RequiredOrNull<number>;
  interaxleSpacing?: RequiredOrNull<number>;
  axleUnitWeight?: RequiredOrNull<number>;
  // TODO change this to numberOfWheels in policy engine and frontend
  numberOfTires?: RequiredOrNull<number>;
  tireSize?: RequiredOrNull<number>;
}

// the type expected by the calculateBridge function in the policy engine
export interface AxleConfiguration {
  numberOfAxles: number;
  axleSpread?: number;
  interaxleSpacing?: number;
  axleUnitWeight: number;
  numberOfTires?: number;
  tireSize?: number;
}
