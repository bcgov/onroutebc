import { Nullable } from "../../../types/common";

export interface TabComponentProps {
  label: string;
  // TODO remove this if we no longer need tab counters
  // count?: Nullable<number>;
  component: JSX.Element;
}
