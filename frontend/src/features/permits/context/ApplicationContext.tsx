import { Dispatch, ReactElement, createContext } from "react";
import { Application } from "../types/application";

interface ApplicationContextType {
  applicationData: Application | undefined;
  setApplicationData: Dispatch<Application>;
  next: () => void;
  back: () => void;
  goTo: (index: number) => void;
  steps?: ReactElement;
  currentStepIndex?: number;
  step?: ReactElement;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

export const ApplicationContext = createContext<ApplicationContextType>({
  applicationData: undefined,
  setApplicationData: (() => undefined) as Dispatch<Application>,
  next: () => undefined,
  back: () => undefined,
  goTo: () => undefined,
});
