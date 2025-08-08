import { createContext } from "react";
import { VoidPermitFormData } from "../types/VoidPermit";
import { Nullable } from "../../../../../common/types/common";
import { Permit } from "../../../types/permit";

interface VoidPermitContextType {
  permit?: Nullable<Permit>;
  voidPermitData: VoidPermitFormData;
  setVoidPermitData: (data: VoidPermitFormData) => void;
  next: () => void;
  back: () => void;
  goHome: () => void;
  goHomeSuccess: () => void;
  handleFail: () => void;
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
  goHome: () => undefined,
  goHomeSuccess: () => undefined,
  handleFail: () => undefined,
});
