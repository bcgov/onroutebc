import { CreditAccount } from '../../modules/credit-account/entities/credit-account.entity';
import { CreditAccountStatus } from '../enum/credit-account-status-type.enum';

export const isActiveCreditAccount = (creditAccount: CreditAccount) => {
  return (
    creditAccount?.creditAccountStatusType ===
    CreditAccountStatus.ACCOUNT_ACTIVE
  );
};

export const isClosedCreditAccount = (creditAccount: CreditAccount) => {
  return (
    creditAccount?.creditAccountStatusType ===
    CreditAccountStatus.ACCOUNT_CLOSED
  );
};

export const isOnHoldCreditAccount = (creditAccount: CreditAccount) => {
  return (
    creditAccount?.creditAccountStatusType ===
    CreditAccountStatus.ACCOUNT_ON_HOLD
  );
};
