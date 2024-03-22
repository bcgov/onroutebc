import { Nullable } from "../../../../../types/common";

export interface TabComponentProps {
  label: string;
  count?: Nullable<number>;
  component: JSX.Element;
}
