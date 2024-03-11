import { createContext } from "react";

import { Permit } from "../../../types/permit";
import { PermitHistory } from "../../../types/PermitHistory";
import { Nullable } from "../../../../../common/types/common";
import { Application } from "../../../types/application";

interface AmendPermitContextType {
  permit?: Nullable<Permit>;
  amendmentApplication?: Nullable<Application>;
  permitHistory: PermitHistory[];
  setAmendmentApplication: (application?: Nullable<Application>) => void;
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
  setAmendmentApplication: () => undefined,
  back: () => undefined,
  next: () => undefined,
  goTo: () => undefined,
  goHome: () => undefined,
  afterFinishAmend: () => undefined,
  getLinks: () => [],
  currentStepIndex: 0,
});
