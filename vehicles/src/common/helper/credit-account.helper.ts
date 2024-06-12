import { CreditAccount } from '../../modules/credit-account/entities/credit-account.entity';
import { CreditAccountStatusType } from '../enum/credit-account-status-type.enum';

export const isActiveCreditAccount = (
  existingHolderOfCreditAccount: CreditAccount,
) => {
  return (
    existingHolderOfCreditAccount?.creditAccountStatusType ===
      CreditAccountStatusType.ACCOUNT_ACTIVE ||
    existingHolderOfCreditAccount?.creditAccountStatusType ===
      CreditAccountStatusType.ACCOUNT_SETUP
  );
};
