import { createContext } from "react";

import { Permit } from "../../../types/permit";
import { AmendPermitFormData } from "../types/AmendPermitFormData";
import { PermitHistory } from "../../../types/PermitHistory";
import { Nullable } from "../../../../../common/types/common";

interface AmendPermitContextType {
  permit?: Nullable<Permit>;
  permitFormData?: Nullable<AmendPermitFormData>;
  permitHistory: PermitHistory[];
  setPermitFormData: (formData: AmendPermitFormData) => void;
  back: () => void;
  next: () => void;
  goTo: (index: number) => void;
  goHome: () => void;
  afterFinishAmend: () => void;
  getLinks: () => { text: string; onClick?: () => void }[];
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
