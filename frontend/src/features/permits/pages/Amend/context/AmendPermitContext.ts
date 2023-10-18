import { createContext } from "react";

import { ReadPermitDto } from "../../../types/permit";
import { AmendPermitFormData } from "../types/AmendPermitFormData";
import { PermitHistory } from "../../../types/PermitHistory";

interface AmendPermitContextType {
  permit?: ReadPermitDto | null;
  permitFormData?: AmendPermitFormData | null;
  permitHistory: PermitHistory[];
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
  permitHistory: [],
  setPermitFormData: () => undefined,
  back: () => undefined,
  next: () => undefined,
  goTo: () => undefined,
  goHome: () => undefined,
  afterFinishAmend: () => undefined,
  getLinks: () => [],
  currentStepIndex: 0,
});
