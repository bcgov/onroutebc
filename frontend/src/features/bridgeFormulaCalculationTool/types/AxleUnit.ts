import { RequiredOrNull } from "../../../common/types/common";

export interface AxleUnit {
  numberOfAxles?: RequiredOrNull<number>;
  axleSpread?: RequiredOrNull<number>;
  interaxleSpacing?: RequiredOrNull<number>;
  axleUnitWeight?: RequiredOrNull<number>;
  // TODO change this to numberOfWheels in policy engine and frontend
  numberOfTires?: RequiredOrNull<number>;
  tireSize?: RequiredOrNull<number>;
}
