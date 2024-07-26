import { useGetCreditAccountMetadataQuery } from "../hooks/creditAccount";
import { CreditAccount } from "./CreditAccount";

export const CreditAccountMetadataComponent = ({ companyId }: { companyId: number }) => {
  const { data: creditAccountMetadata, isPending } =
    useGetCreditAccountMetadataQuery(companyId);

  if (!isPending && creditAccountMetadata) {
    return (
      <CreditAccount
        companyId={companyId}
        creditAccountMetadata={creditAccountMetadata}
      />
    );
  }
  return <></>;
};
