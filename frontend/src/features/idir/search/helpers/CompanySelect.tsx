import { VerifiedClient } from "../../../../common/authentication/types";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import * as routes from "../../../../routes/constants";
import { OnRouteBCContextType } from "../../../../common/authentication/OnRouteBCContext"; // Assuming you have a type

export const onCompanyClick = (
  selectedCompany: CompanyProfile | VerifiedClient,
  context: OnRouteBCContextType,
  navigate: ReturnType<typeof import("react-router-dom").useNavigate>,
) => {
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
    navigate(routes.APPLICATIONS_ROUTES.BASE);
  } else {
    setUnclaimedClient?.(() => {
      const {
        migratedClientHash,
        mailingAddress,
        email,
        alternateName,
        phone,
        extension,
        isSuspended,
        directory,
      } = selectedCompany as VerifiedClient;

      return {
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
      };
    });

    setIsCompanySuspended?.(() => isSuspended);
    navigate(routes.IDIR_ROUTES.CREATE_COMPANY);
  }
};
