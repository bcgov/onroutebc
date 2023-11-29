import { Dispatch, createContext } from "react";
import { Application } from "../types/application";

interface ApplicationContextType {
  applicationData: Application | undefined;
  setApplicationData: Dispatch<Application>;
}

export const ApplicationContext = createContext<ApplicationContextType>({
  applicationData: undefined,
  setApplicationData: (() => undefined) as Dispatch<Application>,
});
