import { useContext } from "react";
import OnRouteBCContext from "../../authentication/OnRouteBCContext";

/**
 * Hook that clears the company context from OnRouteBCContext.
 */
export const useClearCompanyContext = () => {
  const { setCompanyId, setCompanyLegalName, setOnRouteBCClientNumber } =
    useContext(OnRouteBCContext);
  setCompanyId?.(() => undefined);
  setCompanyLegalName?.(() => undefined);
  setOnRouteBCClientNumber?.(() => undefined);
};
