import { Dispatch, createContext } from "react";

import { Application } from "../types/application";
import { Nullable } from "../../../common/types/common";

interface ApplicationContextType {
  applicationData: Nullable<Application>;
  setApplicationData: Dispatch<Nullable<Application>>;
}

export const ApplicationContext = createContext<ApplicationContextType>({
  applicationData: undefined,
  setApplicationData: (() => undefined) as Dispatch<Nullable<Application>>,
});
