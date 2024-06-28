import { CreditAccount } from '../../modules/credit-account/entities/credit-account.entity';
import { CreditAccountActivityType } from '../enum/credit-account-activity-type.enum';
import {
  CreditAccountStatus,
  CreditAccountStatusType,
  CreditAccountStatusValid,
} from '../enum/credit-account-status-type.enum';

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

export const getCreditAccountActivityType = (
  creditAccount: CreditAccount,
  statusToUpdateTo: CreditAccountStatusType,
) => {
  switch (statusToUpdateTo) {
    case CreditAccountStatusValid.ACCOUNT_ACTIVE:
      if (isClosedCreditAccount(creditAccount)) {
        return CreditAccountActivityType.ACCOUNT_REOPENED;
      } else if (isOnHoldCreditAccount(creditAccount)) {
        return CreditAccountActivityType.ACCOUNT_HOLD_REMOVED;
      }
      break;
    case CreditAccountStatusValid.ACCOUNT_ON_HOLD:
      return CreditAccountActivityType.ACCOUNT_ON_HOLD;
    case CreditAccountStatusValid.ACCOUNT_CLOSED:
      return CreditAccountActivityType.ACCOUNT_CLOSED;
  }
};
