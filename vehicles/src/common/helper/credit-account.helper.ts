import { CreditAccount } from '../../modules/credit-account/entities/credit-account.entity';
import { CreditAccountStatusType } from '../enum/credit-account-status-type.enum';

export const isActiveCreditAccount = (creditAccount: CreditAccount) => {
  return (
    creditAccount?.creditAccountStatusType ===
      CreditAccountStatusType.ACCOUNT_ACTIVE
  );
};

export const isClosedCreditAccount = (creditAccount: CreditAccount) => {
  return (
    creditAccount?.creditAccountStatusType ===
    CreditAccountStatusType.ACCOUNT_CLOSED
  );
};
