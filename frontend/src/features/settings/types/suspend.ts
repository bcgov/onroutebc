import { Nullable } from "../../../common/types/common";

export const SUSPEND_ACTIVITY_TYPES = {
  SUSPEND_COMPANY: "SUSPEND",
  UNSUSPEND_COMPANY: "UNSUSPEND",
} as const;

export type SuspendActivityType =
  (typeof SUSPEND_ACTIVITY_TYPES)[keyof typeof SUSPEND_ACTIVITY_TYPES];

export interface SuspendData {
  comment?: Nullable<string>;
  suspendActivityType: SuspendActivityType;
}

export interface SuspendHistoryData extends SuspendData {
  activityId: number;
  userName: string;
  suspendActivityDateTime?: Nullable<string>;
}
