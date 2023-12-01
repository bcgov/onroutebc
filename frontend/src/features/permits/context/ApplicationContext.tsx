import { Dispatch, createContext } from "react";
import { Application } from "../types/application";

interface ApplicationContextType {
  applicationData: Application | null | undefined;
  setApplicationData: Dispatch<Application | null | undefined>;
}

export const ApplicationContext = createContext<ApplicationContextType>({
  applicationData: undefined,
  setApplicationData: (() => undefined) as Dispatch<Application | null | undefined>,
});
