import { Dispatch, createContext } from "react";
import { Application } from "../types/application";

type NullableApplication = Application | null | undefined;

interface ApplicationContextType {
  applicationData: NullableApplication;
  setApplicationData: Dispatch<NullableApplication>;
}

export const ApplicationContext = createContext<ApplicationContextType>({
  applicationData: undefined,
  setApplicationData: (() => undefined) as Dispatch<NullableApplication>,
});
