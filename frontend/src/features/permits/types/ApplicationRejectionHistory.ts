import { Dayjs } from "dayjs";

export interface ApplicationRejectionHistory {
  caseActivityId: number;
  userName: string;
  dateTime: Dayjs;
  caseNotes: string;
}
