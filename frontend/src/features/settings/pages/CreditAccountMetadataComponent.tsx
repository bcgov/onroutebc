import { RenderIf } from "../../../common/components/reusable/RenderIf";
import { useGetCreditAccountMetadataQuery } from "../hooks/creditAccount";
import { AddCreditAccount } from "./AddCreditAccount";
import { ViewCreditAccount } from "./ViewCreditAccount";

export const CreditAccountMetadataComponent = ({
  companyId,
}: {
  companyId: number;
}) => {
  const { data: creditAccountMetadata, isPending } =
    useGetCreditAccountMetadataQuery(companyId);

  if (!isPending) {
    if (creditAccountMetadata) {
      return (
        <ViewCreditAccount
          companyId={companyId}
          creditAccountMetadata={creditAccountMetadata}
        />
      );
    } else {
      return (
        <RenderIf
          component={<AddCreditAccount companyId={companyId} />}
          permissionMatrixFeatureKey="MANAGE_SETTINGS"
          permissionMatrixFunctionKey="UPDATE_CREDIT_ACCOUNT_DETAILS"
        />
      );
    }
  }
  return <></>;
};
