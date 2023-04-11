import { Dispatch, createContext } from "react";
import { TermOversizeApplication } from "../types/application";

interface ApplicationContextType {
  applicationData: TermOversizeApplication | undefined;
  setApplicationData: Dispatch<TermOversizeApplication>;
  next: () => void;
  back: () => void;
  goTo: (index: number) => void;
}

export const ApplicationContext = createContext<ApplicationContextType>({
  applicationData: undefined,
  setApplicationData: (() => undefined) as Dispatch<TermOversizeApplication>,
  next: () => undefined,
  back: () => undefined,
  goTo: () => undefined,
});
