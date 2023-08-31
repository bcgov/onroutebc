import { createContext } from "react";
import { VoidPermitDto } from "../types/VoidPermitDto";

interface VoidPermitContextType {
  voidPermitData: VoidPermitDto;
  setVoidPermitData: (data: VoidPermitDto) => void;
  next: () => void;
  back: () => void;
}

export const VoidPermitContext = createContext<VoidPermitContextType>({
  voidPermitData: {
    permitId: "",
    revoke: false,
    refund: true,
  },
  setVoidPermitData: () => undefined,
  next: () => undefined,
  back: () => undefined,
});
