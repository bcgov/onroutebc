import { RenderIf } from "../../../common/components/reusable/RenderIf";
import { useGetCreditAccountMetadataQuery } from "../hooks/creditAccount";
import { ViewCreditAccount } from "./ViewCreditAccount";
import { InfoBcGovBanner } from "../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../common/constants/bannerMessages";
import "./CreditAccountMetadataComponent.scss";
import {
  CVSE_REVENUE_PHONE,
  CVSE_REVENUE_EMAIL,
} from "../../../common/constants/constants";
import { useContext } from "react";
import OnRouteBCContext from "../../../common/authentication/OnRouteBCContext";
import { IDIR_USER_ROLE } from "../../../common/authentication/types";
import { NoRecordsFound } from "../../../common/components/table/NoRecordsFound";
import { AxiosError } from "axios";

export const CreditAccountMetadataComponent = ({
  companyId,
}: {
  companyId: number;
}) => {
  const {
    data: creditAccountMetadata,
    isPending,
    isError: isCreditAccountMetadataError,
    error: creditAccountMetadataError,
  } = useGetCreditAccountMetadataQuery(companyId, true);

  const isCreditAccountNotFound =
    isCreditAccountMetadataError &&
    creditAccountMetadataError instanceof AxiosError &&
    creditAccountMetadataError.response?.status === 404;

  const { idirUserDetails } = useContext(OnRouteBCContext);
  const isFinanceUser = idirUserDetails?.userRole === IDIR_USER_ROLE.FINANCE;

  if (
    isCreditAccountMetadataError &&
    creditAccountMetadataError instanceof AxiosError &&
    creditAccountMetadataError.response?.status !== 404
  ) {
    throw creditAccountMetadataError;
  }

  if (!isPending) {
    if (creditAccountMetadata && !isCreditAccountNotFound) {
      return (
        <ViewCreditAccount
          companyId={companyId}
          creditAccountMetadata={creditAccountMetadata}
          fromTab="MANAGE_SETTINGS"
        />
      );
    } else if (isFinanceUser) {
      return (
        <RenderIf
          component={<NoRecordsFound />}
          permissionMatrixKeys={{
            permissionMatrixFeatureKey: "MANAGE_SETTINGS",
            permissionMatrixFunctionKey: "ADD_CREDIT_ACCOUNT_HOLDER",
          }}
        />
      );
    } else {
      // Display info box for non-finance staff users who
      // do not have permission to create a new credit account.
      return (
        <div className="non-finance-container">
          <InfoBcGovBanner
            msg={
              <div className="non-finance-container__banner">
                {BANNER_MESSAGES.NON_FINANCE_USER}
                Phone:
                <span className="non-finance-container__info">
                  {CVSE_REVENUE_PHONE}{" "}
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
