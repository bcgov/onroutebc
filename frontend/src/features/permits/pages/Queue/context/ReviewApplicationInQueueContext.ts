import { Dispatch, createContext } from "react";

import { Application } from "../../../types/application";
import { Nullable } from "../../../../../common/types/common";

interface ReviewApplicationInQueueContextType {
  applicationData: Nullable<Application>;
  setApplicationData: Dispatch<Nullable<Application>>;
}

export const ReviewApplicationInQueueContext =
  createContext<ReviewApplicationInQueueContextType>({
    applicationData: undefined,
    setApplicationData: (() => undefined) as Dispatch<Nullable<Application>>,
  });