import { Nullable } from "../../../types/common";

export interface TabComponentProps {
  label: string;
  component: JSX.Element;
  componentKey?: string | number;
  count?: Nullable<number>;
}
