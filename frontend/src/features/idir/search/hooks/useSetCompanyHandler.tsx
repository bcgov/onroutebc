// hooks/useSetCompanyHandler.ts
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import * as routes from "../../../../routes/constants";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { VerifiedClient } from "../../../../common/authentication/types";

type CompanyOrClient = CompanyProfile | VerifiedClient;

export const useSetCompanyHandler = (
  redirectRoute: string = routes.APPLICATIONS_ROUTES.BASE,
) => {
  const navigate = useNavigate();
  const context = useContext(OnRouteBCContext);

  return (selectedCompany: CompanyOrClient) => {
    const {
      setCompanyId,
      setCompanyLegalName,
      setOnRouteBCClientNumber,
      setUnclaimedClient,
      setIsCompanySuspended,
    } = context;

    const { companyId, legalName, clientNumber, primaryContact, isSuspended } =
      selectedCompany;

    if (primaryContact?.firstName) {
      setCompanyId?.(() => companyId);
      setCompanyLegalName?.(() => legalName);
      setOnRouteBCClientNumber?.(() => clientNumber);
      setIsCompanySuspended?.(() => isSuspended);
      sessionStorage.setItem("onRouteBC.user.companyId", companyId.toString());
      navigate(redirectRoute);
    } else {
      const {
        migratedClientHash,
        mailingAddress,
        email,
        alternateName,
        phone,
        extension,
        directory,
      } = selectedCompany as VerifiedClient;

      setUnclaimedClient?.(() => ({
        clientNumber,
        companyId,
        legalName,
        migratedClientHash,
        mailingAddress,
        email,
        phone,
        extension,
        alternateName,
        isSuspended,
        directory,
      }));
      setIsCompanySuspended?.(() => isSuspended);
      navigate(routes.IDIR_ROUTES.CREATE_COMPANY);
    }
  };
};
