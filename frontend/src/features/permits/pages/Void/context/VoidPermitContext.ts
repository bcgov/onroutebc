import { createContext } from "react";
import { VoidPermitFormData } from "../types/VoidPermit";

interface VoidPermitContextType {
  voidPermitData: VoidPermitFormData;
  setVoidPermitData: (data: VoidPermitFormData) => void;
  next: () => void;
  back: () => void;
}

export const VoidPermitContext = createContext<VoidPermitContextType>({
  voidPermitData: {
    permitId: "",
    reason: "",
    revoke: false,
  },
  setVoidPermitData: () => undefined,
  next: () => undefined,
  back: () => undefined,
});
