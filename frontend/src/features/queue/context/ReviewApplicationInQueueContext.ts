import { Dispatch, createContext } from "react";
import { Nullable } from "../../../common/types/common";
import { Application } from "../../permits/types/application";

interface ReviewApplicationInQueueContextType {
  applicationData: Nullable<Application>;
  setApplicationData: Dispatch<Nullable<Application>>;
}

export const ReviewApplicationInQueueContext =
  createContext<ReviewApplicationInQueueContextType>({
    applicationData: undefined,
    setApplicationData: (() => undefined) as Dispatch<Nullable<Application>>,
  });
