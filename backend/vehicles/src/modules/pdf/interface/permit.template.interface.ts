import { PermitData } from "./permitData.interface";

export interface PermitTemplate {
  permitName: string;
  permitNumber: string;
  revisions: Revision[];
  permitData?: PermitData;
}

interface Revision {
  timeStamp: string;
  description: string;
}