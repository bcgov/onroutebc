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
      // Todo: ORV2-2771 Display info box for non-finance staff users who
      // do not have permission to create a new credit account.
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
    }
  }
  return <></>;
};
