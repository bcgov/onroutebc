import { createContext } from "react";

import { ReadPermitDto } from "../../../types/permit";
import { AmendPermitFormData } from "../types/AmendPermitFormData";

interface AmendPermitContextType {
  permit?: ReadPermitDto | null;
  updatedPermitFormData?: AmendPermitFormData | null;
  setPermit: (permit?: ReadPermitDto | null) => void;
  setPermitFormData: (formData: AmendPermitFormData) => void;
  back: () => void;
  next: () => void;
  goTo: (index: number) => void;
  goHome: () => void;
  afterFinishAmend: () => void;
  getLinks: () => { text: string; onClick?: () => void; }[];
  currentStepIndex: number;
}

export const AmendPermitContext = createContext<AmendPermitContextType>({
  setPermit: () => undefined,
  setPermitFormData: () => undefined,
  back: () => undefined,
  next: () => undefined,
  goTo: () => undefined,
  goHome: () => undefined,
  afterFinishAmend: () => undefined,
  getLinks: () => [],
  currentStepIndex: 0,
});
