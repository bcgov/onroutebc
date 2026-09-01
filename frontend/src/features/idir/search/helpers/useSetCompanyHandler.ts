import { useNavigate } from "react-router-dom";
import { useCallback, useContext } from "react";
import OnRouteBCContext from "../../../../common/authentication/OnRouteBCContext";
import * as routes from "../../../../routes/constants";
import { CompanyProfile } from "../../../manageProfile/types/manageProfile";
import { VerifiedClient } from "../../../../common/authentication/types";
import { usePermissionMatrix } from "../../../../common/authentication/PermissionMatrix";
import { getDefaultRequiredVal } from "../../../../common/helpers/util";

export type CompanyOrClient = CompanyProfile | VerifiedClient;

/**
 * Hook that sets the company info in the context and sessionStorage, and redirects to a company's
 * specified location.
 * @returns Callback method for selecting a company
 */
export const useSetCompanyHandler = () => {
  const navigate = useNavigate();

  const context = useContext(OnRouteBCContext);

  const {
    setCompanyId,
    setCompanyLegalName,
    setOnRouteBCClientNumber,
    setUnclaimedClient,
    setIsCompanySuspended,
  } = context;

  const canClaimCompany = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "GLOBAL_SEARCH",
      permissionMatrixFunctionKey: "CREATE_COMPANY",
    },
  });

  const handleSelectCompany = useCallback(
    (
      selectedCompany: CompanyOrClient,
      redirectToRouteForCompany?: string,
    ) => {
      const {
        companyId,
        legalName,
        clientNumber,
        primaryContact,
        isSuspended,
      } = selectedCompany;

      const companyHasBeenClaimed = Boolean(primaryContact?.firstName);

      if (companyHasBeenClaimed || !canClaimCompany) {
        setCompanyId?.(() => companyId);
        setCompanyLegalName?.(() => legalName);
        setOnRouteBCClientNumber?.(() => clientNumber);
        setIsCompanySuspended?.(() => isSuspended);
        sessionStorage.setItem(
          "onRouteBC.user.companyId",
          companyId.toString(),
        );

        const redirectToRoute = getDefaultRequiredVal(
          routes.APPLICATIONS_ROUTES.BASE,
          redirectToRouteForCompany,
        );

        navigate(redirectToRoute);
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
    },
    [canClaimCompany],
  );
  return { handleSelectCompany };
};
