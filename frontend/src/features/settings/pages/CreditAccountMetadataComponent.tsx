import { RenderIf } from "../../../common/components/reusable/RenderIf";
import { useGetCreditAccountMetadataQuery } from "../hooks/creditAccount";
import { AddCreditAccount } from "./AddCreditAccount";
import { ViewCreditAccount } from "./ViewCreditAccount";
import { InfoBcGovBanner } from "../../../common/components/banners/InfoBcGovBanner";
import { BANNER_MESSAGES } from "../../../common/constants/bannerMessages";
import "./CreditAccountMetadataComponent.scss";
import { usePermissionMatrix } from "../../../common/authentication/PermissionMatrix";

export const CreditAccountMetadataComponent = ({
  companyId,
}: {
  companyId: number;
}) => {
  const { data: creditAccountMetadata, isPending } =
    useGetCreditAccountMetadataQuery(companyId);

  const showApplicationsInProgressTab = usePermissionMatrix({
    permissionMatrixKeys: {
      permissionMatrixFeatureKey: "MANAGE_SETTINGS",
      permissionMatrixFunctionKey: "ADD_CREDIT_ACCOUNT_NON_HOLDER_OR_USER",
    },
  });
  if (!isPending) {
    if (creditAccountMetadata) {
      return (
        <ViewCreditAccount
          companyId={companyId}
          creditAccountMetadata={creditAccountMetadata}
        />
      );
    } else {
      if (showApplicationsInProgressTab) {
        console.log("Permission:", showApplicationsInProgressTab);
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
        console.log("Permission:", showApplicationsInProgressTab);
        return (
          <div className="non-finance-container">
            <InfoBcGovBanner msg={BANNER_MESSAGES.NON_FINANCE_USER} />
          </div>
        );
      }
    }
  }
  return null;
};
