import { RenderIf } from "../../../common/components/reusable/RenderIf";
import { useGetCreditAccountMetadataQuery } from "../hooks/creditAccount";
import { AddCreditAccount } from "./AddCreditAccount";
import { ViewCreditAccount } from "./ViewCreditAccount";
import { InfoBcGovBanner } from "../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../common/constants/bannerMessages";
import "./CreditAccountMetadataComponent.scss";
import {
  CSVE_REVENUE_PHONE,
  CVSE_REVENUE_EMAIL,
} from "../../../common/constants/constants";
import { useContext } from "react";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { IDIR_USER_ROLE } from "../../../common/authentication/types";

export const CreditAccountMetadataComponent = ({
  companyId,
}: {
  companyId: number;
}) => {
  const { data: creditAccountMetadata, isPending } =
    useGetCreditAccountMetadataQuery(companyId);
  const { idirUserDetails } = useContext(OnRouteBCContext);
  const isFinanceUser = idirUserDetails?.userRole === IDIR_USER_ROLE.FINANCE;
  if (!isPending) {
    if (creditAccountMetadata) {
      return (
        <ViewCreditAccount
          companyId={companyId}
          creditAccountMetadata={creditAccountMetadata}
        />
      );
    } else if (isFinanceUser) {
      return (
        <RenderIf
          component={<AddCreditAccount companyId={companyId} />}
          permissionMatrixKeys={{
            permissionMatrixFeatureKey: "MANAGE_SETTINGS",
            permissionMatrixFunctionKey:
              "ADD_CREDIT_ACCOUNT_NON_HOLDER_OR_USER",
          }}
        />
      );
    } else {
      // Todo: ORV2-2771 Display info box for non-finance staff users who
      // do not have permission to create a new credit account.
      return (
        <div className="non-finance-container">
          <InfoBcGovBanner
            msg={
              <div className="non-finance-container__banner">
                {BANNER_MESSAGES.NON_FINANCE_USER}
                Phone:
                <span className="non-finance-container__info">
                  {CSVE_REVENUE_PHONE}{" "}
                </span>
                Email:
                <span className="non-finance-container__info">
                  {CVSE_REVENUE_EMAIL}
                </span>
              </div>
            }
          />
        </div>
      );
    }
  }
  return <></>;
};
